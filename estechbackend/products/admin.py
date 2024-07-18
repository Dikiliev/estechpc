from django.contrib import admin
from .models import Category, Product, Attribute, AttributeValue, PriceHistory, ProductPhoto, Filter

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'parent']
    search_fields = ['name']
    list_filter = ['parent']

class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'count', 'count_of_orders', 'count_of_likes']
    search_fields = ['name', 'category__name']
    list_filter = ['category']
    readonly_fields = ['count_of_orders', 'count_of_likes']

class AttributeAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

class AttributeValueAdmin(admin.ModelAdmin):
    list_display = ['product', 'attribute', 'value']
    search_fields = ['product__name', 'attribute__name', 'value']
    list_filter = ['attribute']

class PriceHistoryAdmin(admin.ModelAdmin):
    list_display = ['product', 'price', 'date_changed']
    search_fields = ['product__name']
    list_filter = ['date_changed']
    readonly_fields = ['date_changed']

class ProductPhotoAdmin(admin.ModelAdmin):
    list_display = ['product', 'photo']
    search_fields = ['product__name']

class FilterAdmin(admin.ModelAdmin):
    list_display = ['id', 'category', 'attribute']
    search_fields = ['category__name', 'attribute__name']
    list_filter = ['category']


admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Attribute, AttributeAdmin)
admin.site.register(AttributeValue, AttributeValueAdmin)
admin.site.register(PriceHistory, PriceHistoryAdmin)
admin.site.register(ProductPhoto, ProductPhotoAdmin)
admin.site.register(Filter, FilterAdmin)
