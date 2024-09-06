from django.urls import path, include
from .views import (
    CartDetailView, AddProductToCartView, UpdateCartItemView, RemoveProductFromCartView, ClearCartView,
    OrderListCreateView, OrderDetailView, FavoritesDetailView, AddProductToFavoritesView,
    RemoveProductFromFavoritesView, ClearFavoritesView, RemoveSelectedCartItemsView, BulkUpdateCartItemsView
)
from rest_framework import routers


router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),

    # Маршруты для корзины
    path('cart/', CartDetailView.as_view(), name='cart-detail'),
    path('cart/add/', AddProductToCartView.as_view(), name='cart-add-product'),
    path('cart/update/<int:item_id>/', UpdateCartItemView.as_view(), name='cart-update-item'),
    path('cart/bulk-update/', BulkUpdateCartItemsView.as_view(), name='cart-bulk-update'),
    path('cart/remove/<int:item_id>/', RemoveProductFromCartView.as_view(), name='cart-remove-product'),
    path('cart/remove-selected/', RemoveSelectedCartItemsView.as_view(), name='cart-remove-selected'),
    path('cart/clear/', ClearCartView.as_view(), name='cart-clear'),

    # Маршруты для заказов
    path('list/', OrderListCreateView.as_view(), name='order-list-create'),
    path('list/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),

    # Маршруты для избранных товаров
    path('favorites/', FavoritesDetailView.as_view(), name='favorites-detail'),
    path('favorites/add/', AddProductToFavoritesView.as_view(), name='favorites-add-product'),
    path('favorites/remove/<int:product_id>/', RemoveProductFromFavoritesView.as_view(), name='favorites-remove-product'),
    path('favorites/clear/', ClearFavoritesView.as_view(), name='favorites-clear'),
]
