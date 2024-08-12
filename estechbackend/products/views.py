from django.db.models import Avg, Count, Q

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action

from products.models import Product, Category, Filter, Favorite
from .serializers import ProductSerializer, ProductDetailSerializer, CategorySerializer, CategoryFiltersSerializer, \
    FilterSerializer, ParentCategorySerializer, ChildCategorySerializer, FavoriteSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Category.objects.all()
        parent_id = self.request.query_params.get('parent_id', None)
        if parent_id is None:
            queryset = queryset.all()
        elif parent_id == '0':
            queryset = queryset.filter(parent__isnull=True)
        else:
            queryset = queryset.filter(parent_id=parent_id)

        return queryset

    @action(detail=True, methods=['get'])
    def parents(self, request, pk=None):
        category = self.get_object()
        include_yourself = self.request.query_params.get('include_yourself', None)

        parents = []
        if include_yourself and include_yourself == 'true':
            parents.append(category)

        while category.parent:
            category = category.parent
            parents.insert(0, category)
        serializer = ParentCategorySerializer(parents, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def children(self, request, pk=None):
        category = self.get_object()
        children = category.children.all()
        serializer = ChildCategorySerializer(children, many=True)
        return Response(serializer.data)

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()

        # Получение параметров запроса
        category_id = self.request.query_params.get('c')
        min_price = self.request.query_params.get('minp')
        max_price = self.request.query_params.get('maxp')
        include_out_of_stock = self.request.query_params.get('include_out_of_stock', 'false')
        attribute_filters = self.request.query_params.getlist('attribute')

        # Фильтрация по категории
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        # Фильтрация по цене
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Фильтрация по атрибутам
        if attribute_filters:
            q_objects = Q()
            for attr_filter in attribute_filters:
                try:
                    attribute_id, value = attr_filter.split(':')
                    q_objects |= Q(attributes__attribute_value__attribute_id=attribute_id, attributes__attribute_value__value=value)
                except ValueError:
                    continue  # Игнорируем неправильно отформатированные фильтры
            queryset = queryset.filter(q_objects)

        # Фильтрация по наличию
        if include_out_of_stock.lower() != 'true':
            queryset = queryset.filter(count__gt=0)  # Только товары в наличии

        # Агрегация
        queryset = queryset.annotate(
            average_rating=Avg('reviews__rating'),
            count_of_reviews=Count('reviews')
        ).order_by('id')

        return queryset

    def get_serializer_class(self):
        if self.request.query_params.get('include_detail') == 'True':
            return ProductDetailSerializer
        return super().get_serializer_class()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            "request": self.request,
        })
        return context


class CategoryFiltersView(APIView):
    def get(self, request, category_id):
        try:
            category = Category.objects.get(pk=category_id)
            filters = Filter.objects.filter(category=category)
            serializer = FilterSerializer(filters, many=True)
            return Response({
                "id": category.id,
                "name": category.name,
                "filters": serializer.data
            })
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=404)


class FavoriteViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'detail': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Используем get_object_or_404 для более безопасного получения объекта
        product = get_object_or_404(Product, id=product_id)

        favorite, created = Favorite.objects.get_or_create(user=request.user, product=product)
        if not created:
            return Response({'detail': 'Product already in favorites'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = FavoriteSerializer(favorite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        if pk is None:
            return Response({'detail': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        favorite = Favorite.objects.filter(user=request.user, product_id=pk).first()
        if not favorite:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        favorite.delete()
        return Response({'detail': 'Success deleted'}, status=status.HTTP_204_NO_CONTENT)


import json
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from .models import Product, Category
from .forms import JSONUploadForm


def upload_json(request):
    if request.method == 'POST':
        form = JSONUploadForm(request.POST, request.FILES)
        if form.is_valid():
            file = form.cleaned_data['file']
            data = json.load(file)

            for category_name, products in data.items():
                category, _ = Category.objects.get_or_create(name=category_name)

                for item in products:
                    Product.objects.update_or_create(
                        name=item['name'],
                        defaults={
                            'category': category,
                            'price': item['selling_price'],
                            'count': item['count'] - item['sales_count'],
                            'count_of_orders': item['sales_count'],
                        }
                    )

            return HttpResponseRedirect('/admin/products/product/')
    else:
        form = JSONUploadForm()
    return render(request, 'admin/upload_json.html', {'form': form})