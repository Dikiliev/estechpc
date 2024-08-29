from rest_framework import serializers

from community.serializers import ProductReviewSerializer
from .models import Product, ProductPhoto, Category, Attribute, AttributeValue, Filter, ProductAttribute, Favorite


class ParentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ChildCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
    parent = ChildCategorySerializer(read_only=True)
    children = ChildCategorySerializer(many=True, read_only=True, source='children_set')
    image = serializers.ImageField(required=False)

    class Meta:
        model = Category
        fields = '__all__'


class ProductPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPhoto
        fields = ['photo']

class AttributeValueSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='attribute.name')

    class Meta:
        model = AttributeValue
        fields = ['name', 'value']

class ProductAttributeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='attribute_value.attribute.name')
    value = serializers.CharField(source='attribute_value.value')

    class Meta:
        model = ProductAttribute
        fields = ['name', 'value']


class ProductSerializer(serializers.ModelSerializer):
    photos = ProductPhotoSerializer(many=True, read_only=True)

    average_rating = serializers.FloatField(read_only=True)
    count_of_reviews = serializers.IntegerField(read_only=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'short_characteristics', 'description', 'price', 'photos',
                  'average_rating', 'count', 'count_of_reviews', 'count_of_orders', 'is_favorite']

    def get_is_favorite(self, obj):
        request = self.context.get('request', None)
        if request and hasattr(request, "user"):
            if request.user.is_anonymous:
                return False

            return Favorite.objects.filter(user=request.user, product=obj).exists()
        return False


class ProductDetailSerializer(ProductSerializer):
    attributes = ProductAttributeSerializer(source='attributes.all', many=True)

    class Meta:
        model = ProductSerializer.Meta.model
        fields = ProductSerializer.Meta.fields + ['attributes']


class FavoriteSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'product', 'created_at']


# class AttributeValueSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AttributeValue
#         fields = ['value']


class AttributeSerializer(serializers.ModelSerializer):
    values = serializers.SerializerMethodField()

    class Meta:
        model = Attribute
        fields = ['id', 'name', 'values']

    def get_values(self, obj):
        values = AttributeValue.objects.filter(attribute=obj).values_list('value', flat=True).distinct()
        return values   

class FilterSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source='attribute.id')
    name = serializers.ReadOnlyField(source='attribute.name')
    values = serializers.SerializerMethodField()

    class Meta:
        model = Filter
        fields = ['id', 'name', 'values']

    def get_values(self, obj):
        values = AttributeValue.objects.filter(attribute=obj.attribute).values_list('value', flat=True).distinct()
        return values


class CategoryFiltersSerializer(serializers.ModelSerializer):
    filters = FilterSerializer(many=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'filters']
