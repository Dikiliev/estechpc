# Generated by Django 5.0.4 on 2024-09-06 21:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0004_cart_count_likeslist_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='cartitem',
            name='is_selected',
            field=models.BooleanField(default=True),
        ),
    ]
