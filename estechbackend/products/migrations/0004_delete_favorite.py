# Generated by Django 5.0.4 on 2024-09-04 11:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_alter_category_options_category_order_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Favorite',
        ),
    ]