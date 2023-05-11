import torch.nn as nn
import torch.optim as optim


def get_optimizer(optimizer_num, model_params, lr, wd):
    if optimizer_num == 0:
        optimizer = optim.SGD(model_params, lr, weight_decay=wd)
    elif optimizer_num == 1:
        optimizer = optim.SGD(model_params, lr, momentum=0.9, nesterov=True, weight_decay=wd)
    elif optimizer_num == 2:
        optimizer = optim.Adam(model_params, lr, weight_decay=wd)
    elif optimizer_num == 3:
        optimizer = optim.NAdam(model_params, lr, weight_decay=wd)
    elif optimizer_num == 4:
        optimizer = optim.RMSprop(model_params, lr, weight_decay=wd)
    elif optimizer_num == 5:
        optimizer = optim.Adadelta(model_params, lr, weight_decay=wd)
    elif optimizer_num == 6:
        optimizer = optim.Adagrad(model_params, lr, weight_decay=wd)
    return optimizer


def get_criterion(criterion_num):
    if criterion_num == 0:
        criterion = nn.CrossEntropyLoss()
    elif criterion_num == 1:
        criterion = nn.MSELoss()
    elif criterion_num == 2:
        criterion = nn.L1Loss()  # MAE
    return criterion
