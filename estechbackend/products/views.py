from django.db.models import Avg, Count, Q

from rest_framework import viewsets, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.utils import timezone

# from elasticsearch_dsl.query import MultiMatch

from products.models import Product, Category, Filter, Promotion
from .serializers import ProductSerializer, ProductDetailSerializer, CategorySerializer, CategoryFiltersSerializer, \
    FilterSerializer, ParentCategorySerializer, ChildCategorySerializer, PromotionSerializer

# from .documents import ProductIndex


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    pagination_class = None
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = Category.objects.all()
        parent_id = self.request.query_params.get('parent_id', None)
        has_products = self.request.query_params.get('has_products', None)

        # Фильтрация по parent_id
        if parent_id is None:
            queryset = queryset.all()
        elif parent_id == '0':
            queryset = queryset.filter(parent__isnull=True)
        else:
            queryset = queryset.filter(parent_id=parent_id)

        # Фильтрация категорий, у которых есть хотя бы один продукт
        if has_products and has_products == 'true':
            queryset = queryset.filter(products__isnull=False).distinct()

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

        # Получаем параметры запроса
        search_query = self.request.query_params.get('search')
        category_id = self.request.query_params.get('c')
        min_price = self.request.query_params.get('minp')
        max_price = self.request.query_params.get('maxp')
        include_out_of_stock = self.request.query_params.get('include_out_of_stock', 'false')
        attribute_filters = self.request.query_params.getlist('attribute')
        product_ids = self.request.query_params.get('ids')

        # Полнотекстовый поиск через Elasticsearch
        # if search_query:
        #     es_search = ProductIndex.search().query(
        #         MultiMatch(query=search_query, fields=['name'])
        #     )
        #     product_ids_from_search = [hit.meta.id for hit in es_search]
        #     queryset = queryset.filter(id__in=product_ids_from_search)
        
        if product_ids:
            self.pagination_class = None
            queryset = queryset.filter(id__in=product_ids.split(','))

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
                    continue
            queryset = queryset.filter(q_objects)

        # Фильтрация по наличию
        if include_out_of_stock.lower() != 'true':
            queryset = queryset.filter(count__gt=0)

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


class PromotionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PromotionSerializer

    def get_queryset(self):
        now = timezone.now()
        return Promotion.objects.filter(
            Q(is_permanent=True) | Q(start_date__lte=now, end_date__gte=now) | Q(start_date__isnull=True, end_date__isnull=True)
        )

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
            data = json.loads(file.read().decode('utf-8'))

            for item in data:
                category = Category.objects.get_or_create(name=item['category'])[0]

                Product.objects.update_or_create(
                    name=item['name'],
                    defaults={
                        'category': category,
                        'price': item['price'],
                        'count': item['count'],
                        'count_of_orders': item['count_of_orders'],
                    }
                )

            return HttpResponseRedirect('/admin/products/product/')
    else:
        form = JSONUploadForm()
    return render(request, 'admin/upload_json.html', {'form': form})