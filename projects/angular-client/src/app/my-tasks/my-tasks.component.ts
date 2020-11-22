import { Component, OnInit } from '@angular/core';
import { SearchParams } from '../search-common/models/search-params.model';
import { TaskInfo } from '../task-common/models/task-info.model';
import { TaskService } from '../task-common/services/task.service';

@Component({
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss']
})
export class MyTasksComponent implements OnInit {

  tasks: TaskInfo[] = [];

  get myTasks(): TaskInfo[] {
    return this.tasks.filter(task => task?.assigneeId === "1");
  }

  get unassignedTasks(): TaskInfo[] {
    return this.tasks.filter(task => !task.assigneeId);
  }

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    const params: SearchParams = {
      offset: 0,
      rows: 10
    };
    this.taskService.search(params).subscribe(response => {
      this.tasks = response.results;
    });
  }

}
