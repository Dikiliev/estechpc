from django.db import models
from django.conf import settings
from products.models import Product


class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Корзина {self.user}" if self.user else "Анонимная корзина"

    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} в корзине"

    def get_total_price(self):
        return self.product.price * self.quantity

    class Meta:
        verbose_name = "Элемент корзины"
        verbose_name_plural = "Элементы корзины"
        ordering = ("-created_at",)


class LikesList(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Список избранных {self.user}" if self.user else "Анонимный список избранных"

    class Meta:
        verbose_name = "Список избранных"
        verbose_name_plural = "Списки избранных"


class Like(models.Model):
    list = models.ForeignKey(LikesList, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} в списке избранных"

    class Meta:
        verbose_name = "Избранное"
        verbose_name_plural = "Избранные"
        ordering = ("-created_at",)


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Ожидает обработки'
        PROCESSING = 'processing', 'В процессе'
        COMPLETED = 'completed', 'Завершен'
        CANCELED = 'canceled', 'Отменен'

    class DeliveryMethods(models.TextChoices):
        PICKUP = 'pickup', 'Самовывоз'
        DELIVERY = 'delivery', 'Доставка'

    class ContactMethods(models.TextChoices):
        PHONE = 'phone', 'Звонок'
        WHATSAPP = 'whatsapp', 'WhatsApp'
        TELEGRAM = 'telegram', 'Telegram'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    price = models.IntegerField()

    delivery_method = models.CharField(max_length=10, choices=DeliveryMethods.choices, default=DeliveryMethods.PICKUP)
    contact_method = models.CharField(max_length=10, choices=ContactMethods.choices, default=ContactMethods.PHONE)
    contact_info = models.CharField(max_length=255, help_text="Телефонный номер или Telegram ник")
    address = models.CharField(max_length=255, blank=True, null=True, help_text="Адрес для доставки (если выбрана доставка)")

    def __str__(self):
        return f"Заказ {self.id} от {self.user.username}"

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.IntegerField()

    def __str__(self):
        return f"{self.product.name} в заказе {self.order.id}"

    def get_total_price(self):
        return self.price * self.quantity

    class Meta:
        verbose_name = "Элемент заказа"
        verbose_name_plural = "Элементы заказа"
