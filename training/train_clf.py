from .validate import validate_classif


def train_classif(model, train_loader, val_loader, criterion, optimizer, epochs):
    best_score = 0.
    best_state = model.state_dict()
    train_loss = []
    train_acc = []
    validation_loss = []
    validation_acc = []

    for epoch in range(1, epochs + 1):
        loss, acc = train_epoch(model, train_loader, criterion, optimizer)
        val_loss, metrics = validate_classif(model, val_loader, criterion)
        val_acc = metrics['Accuracy']

        train_loss.append(loss)
        train_acc.append(acc)
        validation_loss.append(val_loss)
        validation_acc.append(val_acc)

        if val_acc > best_score:
            best_score = val_acc
            best_state = model.state_dict()
    return best_state, train_loss, train_acc, validation_loss, validation_acc


def train_epoch(model, train_loader, criterion, optimizer):
    model.train()
    total_loss = 0.
    correct = 0
    n_samples = 0

    for batch_idx, (data, target) in enumerate(train_loader):
        optimizer.zero_grad()
        logits = model(data)

        pred = logits.argmax(dim=1, keepdim=True)
        correct += pred.eq(target.view_as(pred)).sum().item()

        loss = criterion(logits, target)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()
        n_samples += len(data)

    epoch_loss = total_loss / len(train_loader)
    epoch_accuracy = correct / n_samples
    return epoch_loss, epoch_accuracy
