def rebalance_order(section):
    section.tasks.order_by('order')
    for i,task in enumerate(task,start = 1):
        task.order = i * 10
        task.save()