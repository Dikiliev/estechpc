# Generated by Django 5.0.4 on 2024-05-02 20:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('community', '0006_alter_productcomment_options_and_more'),
        ('products', '0002_alter_category_options_alter_pricehistory_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='productcomment',
            options={'verbose_name': 'комментарие товаров', 'verbose_name_plural': 'комментарии товаров'},
        ),
        migrations.AlterModelOptions(
            name='productreview',
            options={'ordering': ['-rating'], 'verbose_name': 'отзыв товаров', 'verbose_name_plural': 'отзывы товаров'},
        ),
        migrations.AlterModelOptions(
            name='productreviewcomment',
            options={'verbose_name': 'ответ на отзывы', 'verbose_name_plural': 'ответы на отзывы'},
        ),
        migrations.AlterModelOptions(
            name='usercomment',
            options={'verbose_name': 'комментарие пользователей', 'verbose_name_plural': 'комментарии пользователей'},
        ),
        migrations.AlterField(
            model_name='productcomment',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='products.product'),
        ),
        migrations.AlterField(
            model_name='productreview',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='products.product'),
        ),
        migrations.AlterField(
            model_name='productreviewcomment',
            name='review',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='community.productreview'),
        ),
    ]
