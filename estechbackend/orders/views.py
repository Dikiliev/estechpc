from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.viewsets import ViewSet

from .models import Cart, CartItem, Product, Order, Like, LikesList
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer, LikeSerializer


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

        if not isinstance(quantity, int) or quantity < 0:
            return Response({'success': False, 'message': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = CartItem.objects.get(cart=cart, id=item_id)
            if quantity > 0:
                cart_item.quantity = quantity
                cart_item.save()
            else:
                cart_item.delete()
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

class ClearCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        cart = get_object_or_404(Cart, user=user)
        cart.items.all().delete()
        return Response({'success': True, 'message': 'Cart cleared'}, status=status.HTTP_200_OK)

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


class FavoriteViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        favorites = Like.objects.filter(user=request.user)
        serializer = LikeSerializer(favorites, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic
    def create(self, request):
        user = request.user
        likes_list, created = LikesList.objects.get_or_create(user=user)

        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'detail': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id)

        favorite, created = Like.objects.get_or_create(list=likes_list, product=product)
        if not created:
            return Response({'detail': 'Product already in favorites'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = LikeSerializer(favorite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def destroy(self, request, pk=None):
        if pk is None:
            return Response({'detail': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        favorite = get_object_or_404(Like, user=request.user, product_id=pk)
        favorite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
