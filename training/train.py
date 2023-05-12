

def train_epoch(model, train_loader, criterion, optimizer, task):
    model.train()
    total_loss = 0.
    correct = 0
    n_samples = 0

    for batch_idx, (data, target) in enumerate(train_loader):
        optimizer.zero_grad()
        logits = model(data)

        if task == 'C':
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
