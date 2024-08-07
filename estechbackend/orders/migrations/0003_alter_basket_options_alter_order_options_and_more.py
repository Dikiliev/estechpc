# Generated by Django 5.0.4 on 2024-05-02 20:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_rename_sametypeproduct_orderitem_same_type_product'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='basket',
            options={'verbose_name': 'корзина', 'verbose_name_plural': 'корзины'},
        ),
        migrations.AlterModelOptions(
            name='order',
            options={'verbose_name': 'заказ', 'verbose_name_plural': 'заказы'},
        ),
        migrations.AlterModelOptions(
            name='orderitem',
            options={'verbose_name': 'единица заказов', 'verbose_name_plural': 'единицы заказов'},
        ),
        migrations.AlterModelOptions(
            name='sametypeproducts',
            options={'verbose_name': 'группа товаров', 'verbose_name_plural': 'группы товаров'},
        ),
    ]
