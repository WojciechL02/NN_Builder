from django.db import models


class NetParamsModel(models.Model):
    # username = models.CharField(max_length=50)
    loss = models.CharField(max_length=50)
    optimizer = models.CharField(max_length=50)
    lr = models.FloatField()
    epochs = models.PositiveIntegerField()
    batch = models.PositiveIntegerField()
    layers = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
