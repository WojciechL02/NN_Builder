from .model import Network
from .train_clf import train_classif
from .train_regr import train_regr
from .validate import validate_classif, validate_regr
from .dataset import CSVDataset
from .utils import get_criterion, get_optimizer

import torch
from torch.utils.data import DataLoader, random_split


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

    if TASK == 'C':
        best_state, train_loss, train_metric, val_loss, val_metric = train_classif(model, train_loader, val_loader, criterion, optimizer, EPOCHS)

        model.load_state_dict(best_state)
        test_loss, test_metrics = validate_classif(model, test_loader, criterion)
        torch.save(best_state, f"././nn_models/{params['username']}.pth")

    elif TASK == 'R':
        best_state, train_loss, train_metric, val_loss, val_metric = train_regr(model, train_loader, val_loader, criterion, optimizer, EPOCHS)

        model.load_state_dict(best_state)
        test_loss, test_metrics = validate_regr(model, test_loader, criterion)
        torch.save(best_state, f"././nn_models/{params['username']}.pth")

    results = {
        'task': TASK,
        'test_metrics': test_metrics,
        'train_loss': train_loss,
        'train_metric': train_metric,
        'val_loss': val_loss,
        'val_metric': val_metric
    }
    return results
