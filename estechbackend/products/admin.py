from django.contrib import admin
from .models import Category, Product, Attribute, AttributeValue, PriceHistory, ProductPhoto, Filter, ProductAttribute, Promotion


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'name', 'parent']
    search_fields = ['name']
    list_filter = ['parent']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'count', 'count_of_orders', 'count_of_likes']
    search_fields = ['name', 'category__name']
    list_filter = ['category']
    readonly_fields = ['count_of_orders', 'count_of_likes', 'id']


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(AttributeValue)
class AttributeValueAdmin(admin.ModelAdmin):
    list_display = ['attribute', 'value']
    search_fields = ['attribute__name', 'value']
    list_filter = ['attribute']


@admin.register(ProductAttribute)
class ProductAttributeAdmin(admin.ModelAdmin):
    list_display = ['product', 'attribute_value']
    search_fields = ['product__name', 'attribute_value__name']
    list_filter = ['product']


@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_display = ['product', 'price', 'date_changed']
    search_fields = ['product__name']
    list_filter = ['date_changed']
    readonly_fields = ['date_changed']


@admin.register(ProductPhoto)
class ProductPhotoAdmin(admin.ModelAdmin):
    list_display = ['product', 'photo']
    search_fields = ['product__name']


@admin.register(Filter)
class FilterAdmin(admin.ModelAdmin):
    list_display = ['id', 'category', 'attribute']
    search_fields = ['category__name', 'attribute__name']
    list_filter = ['category']


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_date', 'end_date', 'is_permanent')
    filter_horizontal = ('products',)
