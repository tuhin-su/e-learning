
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ManagementService } from '../../services/management.service';
import { catchError, firstValueFrom, map, of, tap } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { DropdownModule } from 'primeng/dropdown';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ProgressSpinnerModule } from 'primeng/progressspinner';




@Component({
    selector: 'app-student',
    imports: [
        ProgressSpinnerModule,
        TableModule,
        ReactiveFormsModule,
        DialogModule,
        DropdownModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule],

    templateUrl: './student.component.html',
    styleUrl: './student.component.scss',
    providers: [ConfirmationService, MessageService, ManagementService]
})
export class StudentComponent implements OnInit {
    @ViewChild('dt1') dt1!: Table;
    students: any[] = [];
    page: number = 0;  // Start with the first page
    size: number = 15; // Default size (15 records per page)
    loading: boolean = true;
    display: boolean = false;  // Controls dialog visibility
    displayStudentDialog: boolean = false;
    isEditing: boolean = false;
    studentForm: FormGroup = new FormGroup({});
    semesterForm: FormGroup = new FormGroup({});
    loadingService: any;
    stream?: { lable: String, value: Number }[] = [];
    selectedstream: any;
    itemCount = 0;
    totalRecords: any[] = [];

    tableData: any[] = [];
    tableHeaders: string[] = [];
    isLoading = false;
    isDataReceived: boolean = false;
    isErrorData: boolean = false;
    errorTableData: any[] = [];
    requiredHeaders = [];
    // "address", "email", "passwd", "groups", "name", "birth", "course","gender", "phone", "reg", "roll"," semester", "img"


    semesterOptions = [
        { id: 1, name: '1' },
        { id: 2, name: '2' },
        { id: 3, name: '3' },
        { id: 4, name: '4' },
        { id: 5, name: '5' },
        { id: 6, name: '6' },
        { id: 7, name: '7' },
        { id: 8, name: '8' }
    ]


    statusOptions = [
        { label: 'Active', value: 0 },
        { label: 'Inactive', value: 1 },
        { label: 'Suspended', value: 2 }
    ];





    constructor(
        private management: ManagementService,
        private fb: FormBuilder,
        private alert: AlertService
    ) {
        this.studentForm = this.fb.group({
            id: [''],
            roll: ['', Validators.required],
            reg: ['', Validators.required],
            course_id: ['', Validators.required],
            semester: ['', Validators.required],
            status: ['', [Validators.required, Validators.min(0)]],
        });


        this.semesterForm = this.fb.group({
            from_semester: ['', Validators.required],
            semester: ['', Validators.required],
        });

    }

    ngOnInit() {
        this.getCourses()

    }




    onGlobalFilter(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        this.dt1.filterGlobal(inputValue, 'contains');
    }



    exportToExcel(): void {

        const filteredStudents = this.students.map(student => ({
            'Student Name': student.student_name,
            'Roll Number': student.roll,
            'Course': student.course_name,
            'Semester': student.semester,
            'Phone number': student.student_phone
        }));
        const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });

        saveAs(blob, 'students.xlsx');
    }




    fetchStudent() {
        this.loading = true;
        const payload = {
            current: this.students.length,
            max: this.size
        };
        firstValueFrom(this.management.getStudentInfo(payload).pipe(
            tap(
                (response) => {
                    if (response) {
                        this.loading = false
                        this.students.concat(response)
                        this.students = [...this.students, ...response];
                        this.totalRecords = response.totalRecords;
                        // console.log(response);
                        // this.students = response;
                    }
                }),
            catchError((error) => {
                console.error("Error in fetching user data:", error);
                this.loading = false;
                return of({ students: [], totalRecords: 0 });
            })
        )
        )
    }

    openEditDialog(student: any, isEditing: boolean = false): void {
        this.isEditing = isEditing;
        this.studentForm.patchValue({
            id: student.id,
            roll: student.roll,
            reg: student.reg,
            course_id: student.course_id,
            course_name: student.course_name,
            semester: student.semester,
            status: student.status,
        });

        if (!this.isEditing) {
            this.isDataReceived = false;
            this.tableData = [];
        }
        if (!this.isEditing && this.errorTableData) {
            this.isErrorData = false;
            this.errorTableData = [];

        }

        this.display = true;  // Show the dialog
        this.getCourses();
    }



    selectCourse(event: any) {
        this.studentForm.patchValue({
            "course_id": event.value,

        })


    }


    openSemDialogbox(student: any): void {
        this.semesterForm.patchValue({
            from_semester: student.from_semester,
            semester: student.semester,

        });
        this.displayStudentDialog = true;  // Show the dialog

    }

    async getCourses() {
        await firstValueFrom(this.management.getStreamInfo().pipe(
            tap(
                (res) => {
                    if (res) {
                        this.stream = res

                    }
                }
            )
        ));
    }


    async saveStudent() {
        if (this.isEditing) {
            await firstValueFrom(this.management.editStudent(this.studentForm.value).pipe(
                tap(
                    (response) => {
                        if (response) {
                            this.alert.showSuccessAlert(response.message);
                            this.display = false;
                            this.students.forEach((student: any) => {
                                if (student.id == this.studentForm.value.id) {
                                    student.roll = this.studentForm.value.roll;
                                    student.reg = this.studentForm.value.reg;
                                    student.course_id = this.studentForm.value.course_id;
                                    student.semester = this.studentForm.value.semester;
                                    student.status = this.studentForm.value.status;
                                }
                            })
                        }
                    },
                    (error) => {
                        this.alert.showErrorAlert(error.error.message);
                    }
                )
            ));
            return;
        }

        this.display = false;
    }




    async saveSemester() {
        await firstValueFrom(this.management.migrateStudent(this.semesterForm.value).pipe(
            tap(
                (response) => {
                    if (response) {
                        this.alert.showSuccessAlert(response.message);
                        this.displayStudentDialog = false;
                        this.students.forEach((student: any) => {
                            if (student.semester == this.semesterForm.value.from_semester) {
                                student.semester = this.semesterForm.value.semester

                            }
                        })
                    }
                },
                (error) => {
                    this.alert.showErrorAlert(error.error.message);
                }
            )
        ));
        return;
    }


    async deleteStudent(student: any) {
        await firstValueFrom(this.management.deleteStudent(student.id).pipe(
            tap(
                (response) => {
                    if (response) {
                        this.alert.showSuccessAlert(response.message);
                        this.fetchStudent();
                    }
                },
                (error) => {
                    this.alert.showErrorAlert(error.error.message);
                }
            )
        ))
    }



    onScroll(event: any) {
        const {
            first,
            rows
        } = event;

        const totalScrolled = first + rows;

        if (this.students) {
            if (totalScrolled >= this.students.length) {
                console.log("📦 Reached end of scroll!");
                this.fetchStudent()
            }
        }
    }

    onLazyLoad(event: any) {
        this.loading = true;

        setTimeout(() => {
            this.fetchStudent();
            this.loading = false;
        }, 1000);
    }



    // Create student

    onFileSelected(event: Event): void {

        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        this.isLoading = true;
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
            this.readExcel(file);

        } else {
            alert('Unsupported file format. Please upload a CSV or Excel file.');
            this.isLoading = false;
        }
    }


    readExcel(file: File): void {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const data = new Uint8Array(e.target.result);

            // Enable date parsing
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Extract JSON with default empty values
            const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

            if (jsonData.length) {
                // Normalize headers
                const originalHeaders = Object.keys(jsonData[0]);
                this.tableHeaders = originalHeaders.map(h => h.trim().toLowerCase());

                if (!this.validateHeaders(this.tableHeaders)) {
                    alert('Missing required headers. Please ensure the file includes: ' + this.requiredHeaders.join(', '));
                    this.isLoading = false;
                    return;
                }

                jsonData.forEach((originalRow, index) => {
                    const row: any = {};

                    originalHeaders.forEach(h => {
                        const key = h.trim().toLowerCase();
                        let value = originalRow[h];

                        // Convert Date objects to dd/mm/yyyy format
                        if (value instanceof Date) {
                            const day = String(value.getDate()).padStart(2, '0');
                            const month = String(value.getMonth() + 1).padStart(2, '0');
                            const year = value.getFullYear();
                            value = `${year}-${month}-${day}`;
                        }

                        row[key] = value;
                    });

                    setTimeout(() => {
                        this.tableData = [...this.tableData, row];
                        if (index === jsonData.length - 1) this.isLoading = false;
                    }, index * 200);
                });
            } else {
                this.isLoading = false;
            }
        };

        reader.readAsArrayBuffer(file);
        this.isDataReceived = true;
    }




    validateHeaders(headers: string[]): boolean {
        const lowerHeaders = headers.map(h => h.trim().toLowerCase());
        return this.requiredHeaders.every(req => lowerHeaders.includes(req));
    }




    async saveCreateStudent(): Promise<void> {
        if (!this.tableData || !this.tableData.length) {
            this.alert.showErrorAlert('No student data to submit.');
            return;
        }

        const courses = await firstValueFrom(this.management.getStreamInfo());

        for (const student of this.tableData) {
            const matchedCourse = courses.find((course: any) =>
                course.name.toLowerCase().trim() === student.course?.toLowerCase().trim()
            );

            if (!matchedCourse) {
                this.alert.showErrorAlert(`Course not found for student: ${student.name}`);
                continue; // Skip to next student
            }

            const { course, ...rest } = student; // Remove the `course` property

            let studentToSend = {
                ...rest,
                birth: String(student.birth), // Ensure birth is string
                course: matchedCourse.id   // Include only course_id
            };


            try {
                await firstValueFrom(
                    this.management.createStudent(studentToSend).pipe(
                        tap((res) => {
                            if (res) {
                                this.alert.showSuccessAlert(res.message || 'Student created successfully.');
                            }
                        },

                            (error) => {

                                this.isErrorData = false
                                this.errorTableData.push({
                                    ...rest,
                                    course: matchedCourse.name,
                                    error: error?.error?.message || 'Unknown error'

                                });

                                this.isErrorData = true;

                            }

                        )
                    ));

            } catch (error: any) {
                this.alert.showErrorAlert(error?.error?.message || 'Error creating student.');
            }
        }
        console.log(this.errorTableData)

        this.display = true;
        this.fetchStudent(); // Refresh list after processing
    }




    exportErrorData(): void {
        const worksheet = XLSX.utils.json_to_sheet(this.errorTableData);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Error Students');

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });

        saveAs(blob, 'error-students.xlsx');
    }



}
