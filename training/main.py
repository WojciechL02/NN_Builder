from model import Network
from train import train_epoch
from validate import validate_model
from dataset import CSVDataset
from utils import get_criterion, get_optimizer

import torch
from torch.utils.data import DataLoader, random_split


def train_network(params: dict) -> dict:
    # TODO adjust training loop to deal with both class and regr
    # TODO add weight decay in the frontend and to the requests (update the db model)
    TASK = 'classification' if params['loss'] == 0 else 'regression'
    EPOCHS = params['epochs']
    BATCH_SIZE = params['batch']

    dataset_path = f"./datasets/{params['username']}.csv"
    dataset = CSVDataset(dataset_path)

    TRAIN_SIZE = len(dataset) * params['train_size']
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

    best_vacc = 0.
    best_state = None
    train_loss = []
    train_acc = []
    validation_loss = []
    validation_acc = []
    for epoch in range(1, EPOCHS + 1):
        loss, acc = train_epoch(model, train_loader, criterion, optimizer)
        val_loss, val_acc = validate_model(model, val_loader, criterion)

        train_loss.append(loss)
        train_acc.append(acc)
        validation_loss.append(val_loss)
        validation_acc.append(val_acc)

        if val_acc > best_vacc:
            best_vacc = val_acc
            best_state = model.state_dict()

    model.load_state_dict(best_state)
    test_loss, test_acc = validate_model(model, test_loader, criterion)
    torch.save(best_state, f"./nn_models/{params['username']}.pth")

    results = {
        'test_loss': test_loss,
        'test_accuracy': test_acc,
        'train_loss': train_loss,
        'train_accuracy': train_acc,
        'val_loss': validation_loss,
        'val_accuracy': validation_acc
    }
    return results
