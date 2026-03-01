import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DtsCard, DtsButton } from "../../shared";
import { OpenModal } from '../../core/infrastructure';
import { NewDepartment } from './modals/new-department/new-department';

interface Reason {
  text: string;
}

interface Department {
  name: string;
  reasons: Reason[];
  addingReason: boolean;
  newReasonText: string;
}

interface EditingState {
  deptIndex: number;
  reasonIndex: number;
  text: string;
}

@Component({
  selector: 'dts-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, DtsCard, DtsButton],
  templateUrl: './departments.html',
  styles: []
})
export class Departments {

  public editingState: EditingState | null = null;

  public departments: Department[] = Array.from({ length: 20 }, (_, i) => ({
    name: `Dept ${i + 1}`,
    reasons: [
      { text: 'Standard preventive checkup routine' },
      { text: 'Equipment failure' },
      { text: 'Material shortage' },
    ],
    addingReason: false,
    newReasonText: '',
  }));

  public openNewDepartmentModal() {
    OpenModal(NewDepartment);
  }

  public startEdit(deptIndex: number, reasonIndex: number) {
    this.editingState = {
      deptIndex,
      reasonIndex,
      text: this.departments[deptIndex].reasons[reasonIndex].text,
    };
  }

  public saveEdit() {
    if (!this.editingState) return;
    const { deptIndex, reasonIndex, text } = this.editingState;
    if (text.trim()) {
      this.departments[deptIndex].reasons[reasonIndex].text = text.trim();
    }
    this.editingState = null;
  }

  public cancelEdit() {
    this.editingState = null;
  }

  public isEditing(deptIndex: number, reasonIndex: number): boolean {
    return this.editingState?.deptIndex === deptIndex &&
           this.editingState?.reasonIndex === reasonIndex;
  }

  public startAddReason(deptIndex: number) {
    this.departments[deptIndex].addingReason = true;
    this.departments[deptIndex].newReasonText = '';
  }

  public saveNewReason(deptIndex: number) {
    const dept = this.departments[deptIndex];
    if (dept.newReasonText.trim()) {
      dept.reasons.push({ text: dept.newReasonText.trim() });
    }
    dept.addingReason = false;
    dept.newReasonText = '';
  }

  public cancelAddReason(deptIndex: number) {
    this.departments[deptIndex].addingReason = false;
    this.departments[deptIndex].newReasonText = '';
  }

  public deleteReason(deptIndex: number, reasonIndex: number) {
    this.departments[deptIndex].reasons.splice(reasonIndex, 1);
    if (this.isEditing(deptIndex, reasonIndex)) {
      this.editingState = null;
    }
  }

}
