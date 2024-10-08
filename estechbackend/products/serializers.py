from rest_framework import serializers

from community.serializers import ProductReviewSerializer
from orders.models import Like
from .models import Product, ProductPhoto, Category, Attribute, AttributeValue, Filter, ProductAttribute, Promotion


class ParentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ChildCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
    # `parent_id` для записи и `parent` для чтения
    parent_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='parent', write_only=True, required=False, allow_null=True)
    parent = ParentCategorySerializer(read_only=True)
    children = ParentCategorySerializer(many=True, read_only=True, source='children_set')
    image = serializers.ImageField(required=False)
    order = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'parent_id', 'parent', 'children', 'image', 'order']

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

    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'short_characteristics', 'price', 'photos',
                  'average_rating', 'count', 'count_of_reviews', 'count_of_orders']


class ProductDetailSerializer(ProductSerializer):
    attributes = ProductAttributeSerializer(source='attributes.all', many=True)

    class Meta:
        model = ProductSerializer.Meta.model
        fields = ProductSerializer.Meta.fields + ['description', 'attributes']


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


class PromotionSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True)

    class Meta:
        model = Promotion
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'is_permanent', 'products']
