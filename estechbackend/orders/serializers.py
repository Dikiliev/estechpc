from rest_framework import serializers

from products.models import Product
from .models import Cart, CartItem, OrderItem, Order, Like, LikesList
from products.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'is_selected']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_amount']

    def get_total_amount(self, obj):
        total = sum(item.product.price * item.quantity for item in obj.items.all())
        return total


class LikeSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'product', 'created_at']
        read_only_fields = ['id', 'created_at']

class LikesListSerializer(serializers.ModelSerializer):
    items = LikeSerializer(many=True, read_only=True)

    class Meta:
        model = LikesList
        fields = ['id', 'user', 'created_at', 'updated_at', 'items']
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']


class OrderItemReadSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    total_price = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'total_price']

    def get_total_price(self, obj):
        return obj.quantity * obj.price


class OrderItemWriteSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemWriteSerializer(many=True)
    price = serializers.IntegerField(read_only=True)
    delivery_method_display = serializers.CharField(source='get_delivery_method_display', read_only=True)
    contact_method_display = serializers.CharField(source='get_contact_method_display', read_only=True)
    status_display = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'created_at', 'updated_at', 'status', 'status_display',
            'price', 'delivery_method', 'delivery_method_display',
            'contact_method', 'contact_method_display', 'contact_info', 'address', 'items'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'status', 'status_display', 'price']

    def get_status_display(self, obj):
        return obj.get_status_display()

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user

        order = Order(user=user, **validated_data)
        order_items = []
        total_price = 0

        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            price = product.price

            total_price += price * quantity

            order_items.append(
                OrderItem(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=price
                )
            )

        order.price = total_price
        order.save()

        for item in order_items:
            item.save()

        return order

    def to_representation(self, instance):
        """This method is called when the data is serialized to JSON"""
        self.fields['items'] = OrderItemReadSerializer(many=True)
        return super(OrderSerializer, self).to_representation(instance)
