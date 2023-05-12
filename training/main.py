from .model import Network
from .train import train_epoch
from .validate import validate_model
from .dataset import CSVDataset
from .utils import get_criterion, get_optimizer

import torch
from torch.utils.data import DataLoader, random_split
from sklearn.metrics import recall_score, precision_score, f1_score, accuracy_score
from copy import deepcopy


def train_network(params: dict) -> dict:
    TASK = 'C' if params['loss'] == 0 else 'R'
    EPOCHS = params['epochs']
    BATCH_SIZE = params['batch']

    dataset_path = f"././datasets/{params['username']}.csv"
    dataset = CSVDataset(dataset_path)

    TRAIN_SIZE = int(len(dataset) * params['training_size'])
    VAL_SIZE = int((len(dataset) - TRAIN_SIZE) / 2)
    TEST_SIZE = len(dataset) - TRAIN_SIZE - VAL_SIZE

    train_set, val_set, test_set = random_split(
        dataset,
        [TRAIN_SIZE, VAL_SIZE, TEST_SIZE]
    )

    train_loader = DataLoader(train_set, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_set, batch_size=BATCH_SIZE)
    test_loader = DataLoader(test_set, batch_size=BATCH_SIZE)

    model = Network(params['layers'])
    criterion = get_criterion(params['loss'])
    optimizer = get_optimizer(params['optimizer'], model.parameters(), params['lr'], params['wd'])

    metric_functions = {
        'Accuracy': accuracy_score,
        'Recall': recall_score,
        'Precision': precision_score,
        'F1-score': f1_score
    }

    best_score = 0. if TASK == 'C' else float('inf')
    best_state = deepcopy(model.state_dict())
    train_loss = []
    train_acc = []
    validation_loss = []
    validation_acc = []
    for epoch in range(1, EPOCHS + 1):
        loss, acc = train_epoch(model, train_loader, criterion, optimizer, TASK)
        val_loss, metrics = validate_model(model, val_loader, criterion, TASK, metric_functions)
        val_acc = metrics['accuracy']

        train_loss.append(loss)
        train_acc.append(acc)
        validation_loss.append(val_loss)
        validation_acc.append(val_acc)

        if TASK == 'C':
            if val_acc > best_score:
                best_score = val_acc
                best_state = model.state_dict()
        else:
            if val_loss < best_score:
                best_score = val_loss
                best_state = deepcopy(model.state_dict())

    model.load_state_dict(best_state)
    test_loss, test_metrics = validate_model(model, test_loader, criterion, TASK, metric_functions)
    torch.save(best_state, f"././nn_models/{params['username']}.pth")

    if TASK == 'C':
        test_metrics['Loss'] = test_loss

    results = {
        'task': TASK,
        'test': test_metrics,
        'train_loss': train_loss,
        'train_accuracy': train_acc,
        'val_loss': validation_loss,
        'val_accuracy': validation_acc
    }
    return results
