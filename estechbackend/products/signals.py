# products/signals.py

from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver

from .models import Product

from .models import Product
# from .documents import ProductIndex

@receiver(pre_save, sender=Product)
def capture_pre_save_price(sender, instance, **kwargs):
    if instance.pk:
        instance._pre_save_price = Product.objects.get(pk=instance.pk).price
    else:
        instance._pre_save_price = None


@receiver(post_save, sender=Product)
def handle_price_history(sender, instance, created, **kwargs):
    if created:
        instance.add_price_history(instance.price)
    elif (hasattr(instance, '_pre_save_price')
          and instance._pre_save_price is not None and instance._pre_save_price != instance.price):
        instance.add_price_history(instance.price)



# @receiver(post_save, sender=Product)
# def update_product_index(sender, instance, **kwargs):
#     product_index = ProductIndex(
#         meta={'id': instance.id},
#         name=instance.name,
#         description=instance.description,
#         short_characteristics=instance.short_characteristics,
#     )
#     product_index.save()
#
# @receiver(post_save, sender=Product)
# def delete_product_index(sender, instance, **kwargs):
#     try:
#         ProductIndex.get(id=instance.id).delete()
#     except ProductIndex.DoesNotExist:
#         pass