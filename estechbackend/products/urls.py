from django.urls import include, path
from rest_framework import routers

from .views import ProductViewSet, CategoryViewSet, CategoryFiltersView, upload_json

router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'list', ProductViewSet, basename='products')

urlpatterns = [
    path('', include(router.urls)),
    path('categories/<int:category_id>/filters/', CategoryFiltersView.as_view(), name='category-filters'),

    path('admin/upload_json/', upload_json, name='upload_json'),
]