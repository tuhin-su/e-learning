import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
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
import { catchError, firstValueFrom, map, of, switchMap, tap } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { DropdownModule } from 'primeng/dropdown';
import { DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { convertToISODate, convertToMySQLDate } from '../../utility/function';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ScrollerModule } from 'primeng/scroller';
import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'app-user',
    imports: [
        TableModule,
        ReactiveFormsModule,
        DialogModule,
        AvatarModule,
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
        IconFieldModule,
        ScrollerModule
    ],

    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
    providers: [ConfirmationService, MessageService, ManagementService, DatePipe]
})
export class UserComponent implements OnInit {
    @ViewChild('dt1') dt1!: Table;

    users: any[] = [];
    page: number = 0; // Start with the first page
    size: number = 15; // Default size (15 records per page)
    hasmoredata: boolean = false;
    loading: boolean = true;
    display: boolean = false; // Controls dialog visibility
    displayUserDialog: boolean = false;
    isEditing: boolean = false;
    userForm: FormGroup = new FormGroup({});
    semesterForm: FormGroup = new FormGroup({});
    loadingService: any;
    stream?: { lable: String; value: Number }[] = [];
    selectedstream: any;
    totalRecords: any[] = [];
    itemCount = 0;

    genderOptions = [
        { label: 'Male', value: 'M' },
        { label: 'Female', value: 'F' },
        { label: 'Others', value: 'O' }
    ];

    statusOptions = [
        { label: 'Active', value: 0 },
        { label: 'Inactive', value: 1 }
    ];

    semesterOptions = [
        { id: 1, name: '1' },
        { id: 2, name: '2' },
        { id: 3, name: '3' },
        { id: 4, name: '4' },
        { id: 5, name: '5' },
        { id: 6, name: '6' },
        { id: 7, name: '7' },
        { id: 8, name: '8' }
    ];
    groups: Array<{ name: string; value: string }> = [];
    visibleUsers: any[] = [];
    rowsToShow = 20;

    constructor(
        private management: ManagementService,
        private fb: FormBuilder,
        private alert: AlertService,
        private datepipe: DatePipe
    ) {
        this.userForm = this.fb.group({
            id: [''],
            img: [''],
            name: ['', Validators.required],
            phone: ['', Validators.required],
            birth: ['', Validators.required],
            email: ['', Validators.required],
            passwd: [''],
            gender: ['', Validators.required],
            address: ['', Validators.required],
            groups: ['', Validators.required],
            status: [Validators.required]
        });

        this.semesterForm = this.fb.group({
            sem: ['', Validators.required]
        });
    }

    async ngOnInit() {
        const payload = {
            current: this.page, // current page number or index
            max: this.size // number of records per page
        };
        const dropdownGroups = await firstValueFrom(
            this.management.getgroups(payload).pipe(
                tap((response) => console.log('API Response:', response)),
                map((response) => {
                    if (response?.groups?.length) {
                        return response.groups.map((group: any) => ({
                            name: group.name,
                            value: group.code
                        }));
                    }
                    return [];
                }),
                catchError((err) => {
                    console.error('API Error:', err);
                    return of([]); // fallback value
                })
            )
        );
        this.groups = dropdownGroups;
        console.log(this.groups);

        this.fetchUser();
    }

    onGlobalFilter(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        this.dt1.filterGlobal(inputValue, 'contains');
    }

    openSemDialogbox(user: any): void {
        this.semesterForm.patchValue({
            sem: user.semester
        });
        this.displayUserDialog = true; // Show the dialog
    }

    exportToExcel(): void {
        if (!this.users) {
            return;
        }
        const filteredUsers = this.users.map((user) => ({
            Name: user.name,
            Email: user.email,
            Group: user.groups,
            Address: user.address,
            'Phone number': user.phone
        }));
        const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'users');

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });

        saveAs(blob, 'users.xlsx');
    }

    async fetchUser() {
        this.loading = true;
        const payload = {
            current: this.users.length,
            max: this.size
        };

        await firstValueFrom(
            this.management.getUserInfo(payload).pipe(
                tap((response) => {
                    if (response) {
                        this.loading = false;
                        this.users.concat(response);
                        this.users = [...this.users, ...response];
                        this.totalRecords = response.totalRecords;
                        this.visibleUsers = this.users;

                    }
                }),
                catchError((error) => {
                    console.error('Error in fetching user data:', error);
                    this.loading = false;
                    return of({ users: [], totalRecords: 0 });
                })
            )
        );
    }

    // Thu, 12 Dec 2024 00:00:00 GMT

    openEditDialog(user: any, isEditing: boolean = false): void {
        this.isEditing = isEditing;
        const convert_birth = convertToMySQLDate(user.birth);
        this.userForm.patchValue({
            id: user.user_id,
            // img : user.img ,
            name: user.name,
            phone: user.phone,
            gender: user.gender,
            address: user.address,
            birth: convert_birth,
            email: user.email,
            groups: user.groups,
            status: user.status
        });
        this.display = true; // Show the dialog
    }

    async saveUser() {
        if (this.isEditing) {
            await firstValueFrom(
                this.management.editUser(this.userForm.value).pipe(
                    tap(
                        (response) => {
                            if (response) {
                                this.alert.showSuccessAlert(response.message);
                                this.display = false;
                                this.fetchUser();
                            }
                        },
                        (error) => {
                            this.alert.showErrorAlert(error.error.message);
                        }
                    )
                )
            );
            return;
        }

        if (this.userForm.valid) {
            const payload = {
                ...this.userForm.value,
                img: this.userForm.value.img || null
            };

            await firstValueFrom(
                this.management.createUser(payload).pipe(
                    tap(
                        (response) => {
                            if (response) {
                                this.alert.showSuccessAlert(response.message);
                                this.display = false;
                                this.fetchUser();
                            }
                        },
                        (error) => {
                            this.alert.showErrorAlert(error.error.message);
                        }
                    )
                )
            );
        }

        this.display = false;
    }

    async deleteUser(user: any) {
        await firstValueFrom(
            this.management.deleteUser(user.user_id).pipe(
                tap(
                    (response) => {
                        if (response) {
                            this.alert.showSuccessAlert(response.message);
                            this.fetchUser();
                        }
                    },
                    (error) => {
                        this.alert.showErrorAlert(error.error.message);
                    }
                )
            )
        );
    }

    async userInactive() {
        await firstValueFrom(
            this.management.inactiveUser(this.semesterForm.value).pipe(
                tap(
                    (response) => {
                        if (response) {
                            this.alert.showSuccessAlert(response.message);
                            this.displayUserDialog = false;
                            this.fetchUser();
                        }
                    },
                    (error) => {
                        this.alert.showErrorAlert(error.error.message);
                    }
                )
            )
        );
        return;
    }

    onScroll(event: any) {
        const { first, rows } = event;

        const totalScrolled = first + rows;

        if (this.users) {
            if (totalScrolled >= this.users.length) {
                console.log('📦 Reached end of scroll!');
                this.fetchUser();
            }
        }
    }

    onLazyLoad(event: any) {
        this.loading = true;

        setTimeout(() => {
            this.fetchUser();
            this.loading = false;
        }, 1000);
    }
}
