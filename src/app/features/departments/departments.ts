import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DtsCard, DtsButton } from "../../shared";
import { OpenModal } from '../../core/infrastructure';
import { NewDepartment } from './modals/new-department/new-department';
import { DepartmentRequestService } from './services/department-request.service';
import { DepartmentState } from './state/department-state';
import { IEditingState, UIDepartment } from './interfaces/department.interface';
import { DepartmentsSocketManager } from '../../shared/services/departments-socket-manager.service';

@Component({
  selector: 'dts-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, DtsCard, DtsButton],
  templateUrl: './departments.html',
  styles: []
})
export class Departments implements OnInit, OnDestroy {

  private readonly departmentRequest = inject(DepartmentRequestService);
  private readonly departmentState    = inject(DepartmentState);
  private readonly departmentsSocketManager = inject(DepartmentsSocketManager);

  departments$ = this.departmentState.departments;
  loadingDepartments$ = this.departmentState.loadingDepartments;

  public editingState: IEditingState | null = null;

  ngOnInit(): void {
    this.departmentRequest.getDepartments();

    this.departmentsSocketManager.connect();
    this.departmentsSocketManager.onDepartmentCreated(() => this.departmentRequest.getDepartments(false));
    this.departmentsSocketManager.onDepartmentUpdated(() => this.departmentRequest.getDepartments(false));
    this.departmentsSocketManager.onDepartmentDeleted(() => this.departmentRequest.getDepartments(false));
  }

  ngOnDestroy(): void {
    this.departmentsSocketManager.disconnect();
  }

  public openNewDepartmentModal() {
    OpenModal(NewDepartment);
  }

  // ── Editing a reason ──────────────────────────────────────────────────────

  public startEdit(deptIndex: number, reasonIndex: number) {
    const text = this.departments$()[deptIndex].reasons[reasonIndex];
    this.editingState = { deptIndex, reasonIndex, originalText: text, text };
  }

  public saveEdit() {
    if (!this.editingState) return;
    const { deptIndex, reasonIndex, originalText, text } = this.editingState;
    const newText = text.trim();
    this.editingState = null;
    if (!newText || newText === originalText) return;
    const dept = this.departments$()[deptIndex];
    this.departmentRequest.updateReason(dept._id, originalText, newText);
  }

  public cancelEdit() {
    this.editingState = null;
  }

  public isEditing(deptIndex: number, reasonIndex: number): boolean {
    return this.editingState?.deptIndex === deptIndex &&
      this.editingState?.reasonIndex === reasonIndex;
  }

  // ── Adding a new reason ───────────────────────────────────────────────────

  public startAddReason(deptIndex: number) {
    this.departmentState.departments.update(list => {
      const copy = [...list];
      copy[deptIndex] = { ...copy[deptIndex], addingReason: true, newReasonText: '' };
      return copy;
    });
  }

  public saveNewReason(deptIndex: number) {
    const dept = this.departments$()[deptIndex];
    const text = dept.newReasonText.trim();
    this.cancelAddReason(deptIndex);
    if (!text) return;
    this.departmentRequest.addReason(dept._id, text);
  }

  public cancelAddReason(deptIndex: number) {
    this.departmentState.departments.update(list => {
      const copy = [...list];
      copy[deptIndex] = { ...copy[deptIndex], addingReason: false, newReasonText: '' };
      return copy;
    });
  }

  // ── Deleting a reason ─────────────────────────────────────────────────────

  public deleteReason(deptIndex: number, reasonIndex: number) {
    const dept = this.departments$()[deptIndex];
    const reason = dept.reasons[reasonIndex];
    if (this.isEditing(deptIndex, reasonIndex)) this.editingState = null;
    this.departmentRequest.removeReason(dept._id, reason);
  }

  // ── Text binding helper (needed for ngModel on signal-backed object) ──────

  public setNewReasonText(deptIndex: number, value: string) {
    this.departmentState.departments.update(list => {
      const copy = [...list];
      copy[deptIndex] = { ...copy[deptIndex], newReasonText: value };
      return copy;
    });
  }

  // ── Editing department name ──────────────────────────────────────────────

  public startEditDept(deptIndex: number) {
    const name = this.departments$()[deptIndex].department;
    this.departmentState.departments.update(list => {
      const copy = [...list];
      copy[deptIndex] = { ...copy[deptIndex], editingName: true, editingNameText: name };
      return copy;
    });
  }

  public saveEditDept(deptIndex: number) {
    const dept = this.departments$()[deptIndex];
    const newName = dept.editingNameText.trim();
    this.cancelEditDept(deptIndex);
    if (!newName || newName === dept.department) return;
    this.departmentRequest.updateDepartment(dept._id, { department: newName });
  }

  public cancelEditDept(deptIndex: number) {
    this.departmentState.departments.update(list => {
      const copy = [...list];
      copy[deptIndex] = { ...copy[deptIndex], editingName: false, editingNameText: '' };
      return copy;
    });
  }

  public setEditingNameText(deptIndex: number, value: string) {
    this.departmentState.departments.update(list => {
      const copy = [...list];
      copy[deptIndex] = { ...copy[deptIndex], editingNameText: value };
      return copy;
    });
  }

  // ── Deleting a department ────────────────────────────────────────────────

  public deleteDept(deptIndex: number) {
    const dept = this.departments$()[deptIndex];
    this.departmentRequest.deleteDepartment(dept._id);
  }
}

