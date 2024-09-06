from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.viewsets import ViewSet

from .models import Cart, CartItem, Product, Order, Like, LikesList
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer, LikeSerializer, LikesListSerializer


class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        cart, created = Cart.objects.get_or_create(user=user)
        return cart


class AddProductToCartView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        user = request.user
        cart, created = Cart.objects.get_or_create(user=user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        product = get_object_or_404(Product, id=product_id)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += int(quantity)
        else:
            cart_item.quantity = int(quantity)
        cart_item.save()

        return Response({'success': True, 'message': 'Product added to cart'}, status=status.HTTP_200_OK)


class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = request.user
        cart = get_object_or_404(Cart, user=user)
        item_id = kwargs.get('item_id')
        quantity = request.data.get('quantity')
        is_selected = request.data.get('is_selected')

        try:
            cart_item = CartItem.objects.get(cart=cart, id=item_id)

            if quantity is not None:
                if not isinstance(quantity, int) or quantity < 0:
                    return Response({'success': False, 'message': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)

                if quantity > 0:
                    cart_item.quantity = quantity
                else:
                    cart_item.delete()
                    return Response({'success': True, 'message': 'Item removed'}, status=status.HTTP_200_OK)

            if is_selected is not None:
                cart_item.is_selected = is_selected

            cart_item.save()
            return Response({'success': True, 'message': 'Item updated'}, status=status.HTTP_200_OK)

        except CartItem.DoesNotExist:
            return Response({'success': False, 'message': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RemoveProductFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        cart = get_object_or_404(Cart, user=user)
        item_id = kwargs.get('item_id')

        try:
            cart_item = CartItem.objects.get(cart=cart, id=item_id)
            cart_item.delete()
            return Response({'success': True, 'message': 'Product removed from cart'}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({'success': False, 'message': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

class RemoveSelectedCartItemsView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        cart = get_object_or_404(Cart, user=user)
        selected_items = cart.items.filter(is_selected=True)

        if selected_items.exists():
            selected_items.delete()
            return Response({'success': True, 'message': 'Selected items removed'}, status=status.HTTP_200_OK)
        else:
            return Response({'success': False, 'message': 'No selected items found'}, status=status.HTTP_404_NOT_FOUND)

class ClearCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        cart = get_object_or_404(Cart, user=user)
        cart.items.all().delete()
        return Response({'success': True, 'message': 'Cart cleared'}, status=status.HTTP_200_OK)


class FavoritesDetailView(generics.RetrieveAPIView):
    serializer_class = LikesListSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        likes_list, created = LikesList.objects.get_or_create(user=user)
        return likes_list


class AddProductToFavoritesView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        user = request.user
        likes_list, created = LikesList.objects.get_or_create(user=user)
        product_id = request.data.get('product_id')

        product = get_object_or_404(Product, id=product_id)
        favorite, created = Like.objects.get_or_create(list=likes_list, product=product)

        if not created:
            return Response({'success': False, 'message': 'Product already in favorites'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'success': True, 'message': 'Product added to favorites'}, status=status.HTTP_200_OK)


class RemoveProductFromFavoritesView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        likes_list = get_object_or_404(LikesList, user=user)
        product_id = kwargs.get('product_id')

        favorite = get_object_or_404(Like, list=likes_list, product_id=product_id)
        favorite.delete()

        return Response({'success': True, 'message': 'Product removed from favorites'}, status=status.HTTP_200_OK)


class ClearFavoritesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        likes_list = get_object_or_404(LikesList, user=user)
        likes_list.items.all().delete()

        return Response({'success': True, 'message': 'Favorites cleared'}, status=status.HTTP_200_OK)


class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class OrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        order = super().get_object()
        if order.user != self.request.user:
            raise PermissionDenied("Вы не можете просматривать этот заказ.")
        return order

