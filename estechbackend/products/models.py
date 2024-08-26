from django.db import models
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from users.models import User


class Category(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    image = models.ImageField(upload_to='products', blank=True, null=True)

    def __str__(self):
        return f'{self.name}' + f' <- {self.parent}' if self.parent else ''

    class Meta:
        verbose_name = 'категория'
        verbose_name_plural = 'категории'


class Product(models.Model):
    name = models.CharField(max_length=100)
    short_characteristics = models.TextField(blank=True)
    description = models.TextField(blank=True)

    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True, related_name='products')
    price = models.IntegerField()

    count = models.IntegerField(default=1)
    count_of_orders = models.IntegerField(default=0)
    count_of_likes = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    def add_price_history(self, new_price):
        PriceHistory.objects.create(product=self, price=new_price)

    class Meta:
        verbose_name = 'товар'
        verbose_name_plural = 'товары'


class Attribute(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Характеристика'
        verbose_name_plural = 'Характеристики'


class AttributeValue(models.Model):
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE, related_name='values')
    value = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.attribute.name}: {self.value}"

    class Meta:
        verbose_name = 'Значение характеристики'
        verbose_name_plural = 'Значения характеристики'


class ProductAttribute(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='attributes')
    attribute_value = models.ForeignKey(AttributeValue, on_delete=models.CASCADE, related_name='product_attributes')

    class Meta:
        unique_together = ('product', 'attribute_value')
        verbose_name = 'Характеристики товаров'
        verbose_name_plural = 'Характеристика товара'

    def __str__(self):
        return f"{self.product.name} - {self.attribute_value}"


class Filter(models.Model):
    category = models.ForeignKey(Category, related_name='filters', on_delete=models.CASCADE)
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.category.name} - {self.attribute.name}"

    class Meta:
        verbose_name = 'Фильтр'
        verbose_name_plural = 'Фильтры'


class PriceHistory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='price_history')
    price = models.IntegerField()
    date_changed = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.price} on {self.date_changed}"

    class Meta:
        verbose_name = 'история цен'
        verbose_name_plural = 'истории цен'


class ProductPhoto(models.Model):
    product = models.ForeignKey(Product, related_name='photos', on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='products_photos')

    def __str__(self):
        return f"Photo of {self.product.name}"

    class Meta:
        verbose_name = 'фото товаров'
        verbose_name_plural = 'фотографии товаров'


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        verbose_name = 'Лайк'
        verbose_name_plural = 'Лайки'

    def __str__(self):
        return f"{self.user} - {self.product.name}"
