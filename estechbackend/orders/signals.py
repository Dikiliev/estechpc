from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver

from orders.models import Like


@receiver(post_save, sender=Like)
@receiver(post_delete, sender=Like)
def update_favorites_count(sender, instance: Like, **kwargs):
    likes_list = instance.list
    likes_list.count = likes_list.items.count()
    likes_list.save()
