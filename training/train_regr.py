from .validate import validate_regr
from torch.nn.functional import l1_loss


def train_regr(model, train_loader, val_loader, criterion, optimizer, epochs):
    best_score = float('inf')
    best_state = model.state_dict()
    train_loss = []
    train_mae = []
    validation_loss = []
    validation_mae = []

    for epoch in range(1, epochs + 1):
        loss, mae = train_epoch(model, train_loader, criterion, optimizer)
        val_loss, metrics = validate_regr(model, val_loader, criterion)

        train_loss.append(loss)
        train_mae.append(mae)
        validation_loss.append(val_loss)
        validation_mae.append(metrics['MAE'])

        if val_loss < best_score:
            best_score = val_loss
            best_state = model.state_dict()
    return best_state, train_loss, train_mae, validation_loss, validation_mae


def train_epoch(model, train_loader, criterion, optimizer):
    model.train()
    total_loss = 0.
    epoch_mae = 0.

    for batch_idx, (data, target) in enumerate(train_loader):
        optimizer.zero_grad()
        logits = model(data)

        target = target.unsqueeze(1).float()

        epoch_mae += l1_loss(logits, target).item()

        loss = criterion(logits, target)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    epoch_loss = total_loss / len(train_loader)
    epoch_mae /= len(train_loader)
    return epoch_loss, epoch_mae
