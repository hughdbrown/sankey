# Data requirements for use in a workflow
* Fields
** Sankey widget requires three fields: `source`, `target`, and `value`
* Field sources
** `source` is `start_state`
** `target` is `end_state`
** `value` is difference between `start_date` and `end_state` in days
* Possible states
** incomplete task: start_date DATE / start_state int / end_date NULL / end_state NULL
** complete task with next state: start_date DATE / start_state int / end_date DATE / end_state int
** complete task wHich is terminal: start_date DATE / start_state int / end_date DATE / end_state NULL
* Workflow
** Node is created with a `start_state` and `start_date`
** When updated, the node gets an `end_date` and either:
*** the node gets an `end_state` (it is a completed task frpm `start_state` to `end_state`) or
*** the node gets no `end_state` (it is a terminal node)
* Value
** If a node has an `end_date`, then `value` is `days(end_date - start_date)`
** If a node has no `end_date`, then `value` is `days(today - start_date)`
