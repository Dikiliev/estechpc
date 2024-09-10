# from elasticsearch_dsl import Document, Text, Integer, connections
#
# # Устанавливаем соединение с Elasticsearch
# connections.create_connection(
#     hosts=['localhost:9200'],
#     timeout=20
# )
#
# class ProductIndex(Document):
#     name = Text()
#     description = Text()
#     short_characteristics = Text()
#
#     class Index:
#         name = 'products'
#
#     def save(self, **kwargs):
#         self.meta.id = self.id
#         return super().save(**kwargs)
