from django.contrib import admin

from .models import Cart, CartItem, Order, OrderItem, LikesList, Like


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'product', 'quantity')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product', 'quantity', 'price')

@admin.register(LikesList)
class LikesListAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'updated_at')
    search_fields = ('user__username', 'user__email')
    list_filter = ('created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('id', 'list', 'product', 'created_at')
    search_fields = ('product__name', 'list__user__username')
    list_filter = ('created_at',)
    readonly_fields = ('created_at',)
    autocomplete_fields = ('product', 'list')
