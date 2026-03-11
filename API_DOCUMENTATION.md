# 📚 AUDYA API - COMPLETE DOCUMENTATION

**Version**: 1.0
**Last Updated**: February 25, 2025
**Base URL**: `http://localhost:8000` (development) / `https://api.audya.com` (production)
**Authentication**: HTTP Sessions + Two-Factor Authentication (2FA)

---

## TABLE OF CONTENTS

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Authentication Routes](#authentication-routes)
4. [Registration Routes](#registration-routes)
5. [Messaging/Chat Routes](#messagingchat-routes)
6. [Document & File Routes](#document--file-routes)
7. [REST API Routes](#rest-api-routes)
8. [Professional Routes](#professional-routes)
9. [Patient Routes](#patient-routes)
10. [Event/Appointment Routes](#eventappointment-routes)
11. [Device Management Routes](#device-management-routes)
12. [Response Formats](#response-formats)
13. [Error Handling](#error-handling)
14. [Security Considerations](#security-considerations)

---

## OVERVIEW

Audya is a healthcare data management platform with role-based access control. The application supports two main user types:
- **Professionals** (Doctors/Healthcare providers)
- **Patients**

The API uses traditional **HTTP session-based authentication** combined with **Two-Factor Authentication** for enhanced security when handling healthcare data (HDS - Données de Santé).

### Architecture Overview
```
User Login
    ↓
First Factor (Email + Password)
    ├─ POST /patient/login (for patients)
    ├─ POST /pro/login (for professionals)
    └─ Sets first-factor cookies for 30 minutes
    ↓
Second Factor (Email-delivered 6-digit code)
    ├─ POST /patient/login/verify (for patients)
    ├─ POST /pro/login/verify (for professionals)
    └─ Validates 2FA code
    ↓
Session Created
    ├─ User authenticated
    └─ Session expires after 5000 minutes (⚠️ Should be 15 min for HDS)
```

---

## AUTHENTICATION

### Session-Based Authentication

The application uses **HTTP-only cookies** for session management. All authenticated requests include the session cookie automatically.

**Important Notes:**
- Sessions last 5000 minutes (~83 hours)
- Two-Factor Authentication (2FA) is required for login
- Sessions are encrypted (when properly configured)
- Logout destroys the session immediately

### Middleware Required

Protected routes require one of these middleware tags:
- `auth.audya` - Any authenticated Audya user
- `auth.role:pro` - Professional/Doctor only
- `auth.role:patient` - Patient only
- `auth.status:notverified` - Not yet verified email
- `auth.status:verified` - Verified but not fully profiled
- `auth.status:profiled` - Fully set up account

### Headers (For All Requests)

```
Accept: application/json
Accept-Language: fr (or en, depending on locale)
X-Requested-With: XMLHttpRequest (for AJAX requests)
```

Session cookie automatically included (HTTPOnly).

---

## AUTHENTICATION ROUTES

### 1. Patient Login - Display Form

```http
GET /patient/login
```

Returns the patient login form page.

**Response**: HTML view (patient.auth.login template)

---

### 2. Patient Login - First Factor

```http
POST /patient/login
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "email": "patient@example.com",
  "password": "secure_password_123"
}
```

**Success Response** (HTTP 302 Redirect):
- Redirects to `/patient/login/verify` (2FA code entry form)
- Sets first-factor cookies for 30 minutes

**Error Response** (HTTP 302 Redirect):
- Returns to login form with error flash message
- Error message examples:
  - "Email not found"
  - "Invalid password"
  - "User account deactivated"
  - "User email not verified"

---

### 3. Patient 2FA Verification

```http
POST /patient/login/verify
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "second_factor": "123456"
}
```

**Success Response** (HTTP 302 Redirect):
- Redirects to `/patient/dashboard`
- Creates authenticated session
- Session expires after 5000 minutes

**Error Responses** (HTTP 302 Redirect):
- **Code incorrect**: "Le code n'est pas valide"
- **Too many tries**: "Trop de tentatives, veuillez demander un nouveau code"
- **Code expired**: "Le code a expiré"
- **User unverified**: Redirect to `/patient/register/verification`
- **User deactivated**: Redirect to deactivation page

---

### 4. Patient - Resend 2FA Code

```http
POST /patient/login/resend
```

Sends a new 2FA code via email.

**Success Response** (HTTP 302 Redirect):
- Message: "Le code d'authentification a été envoyé"
- Redirects back to 2FA form

---

### 5. Professional Login - Display Form

```http
GET /pro/login
```

Returns the professional login form page.

**Response**: HTML view (pro.auth.login template)

---

### 6. Professional Login - First Factor

```http
POST /pro/login
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "email": "doctor@example.com",
  "password": "secure_password_123"
}
```

**Success Response** (HTTP 302 Redirect):
- Redirects to `/pro/login/verify` (2FA code entry form)
- Sets first-factor cookies for 30 minutes

**Error Response** (HTTP 302 Redirect):
- Returns to login form with error message
- Same error types as patient login

---

### 7. Professional 2FA Verification

```http
POST /pro/login/verify
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "second_factor": "123456"
}
```

**Success Response** (HTTP 302 Redirect):
- Redirects to `/pro/dashboard`
- Creates authenticated session

**Error Responses**: Same as patient 2FA verification

---

### 8. Professional - Resend 2FA Code

```http
POST /pro/login/resend
```

Sends a new 2FA code via email.

**Success Response** (HTTP 302 Redirect):
- Message: "Le code d'authentification a été envoyé"

---

### 9. Logout

```http
GET /logout
Requires: auth.audya middleware
```

Destroys the user session and clears authentication cookies.

**Success Response** (HTTP 302 Redirect):
- Redirects to home page (`/`)
- Session deleted from server
- Cookies cleared

**Response Headers:**
```
Set-Cookie: SESSIONID=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/;
Set-Cookie: first_factor_*=; expires=...
```

---

### 10. Verify Account (Email Verification)

```http
GET /verify/{token}
```

Completes email verification for newly registered accounts.

**Parameters:**
- `token` (URL): Email verification token from registration email

**Success Response** (HTTP 302 Redirect):
- Redirects to completion page
- Account marked as verified

**Error Response**:
- "Token invalid or expired" message
- Redirect to re-request verification email

---

### 11. Password Reset - Display Form

```http
GET /reset-password/{token}
```

Shows password reset form.

**Parameters:**
- `token` (URL): Password reset token from email

**Response**: HTML view with password reset form

---

---

## REGISTRATION ROUTES

### PATIENT REGISTRATION

#### 1. Select Account Type

```http
GET /patient/register-account-type
```

Shows options for patient registration type (self or family).

**Response**: HTML form

---

#### 2. Patient Registration Form

```http
GET /patient/register
```

Display registration form for patient.

**Response**: HTML form view

---

#### 3. Submit Patient Registration

```http
POST /patient/register
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "email": "newpatient@example.com",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+33612345678",
  "rgpd_commercial": 0
}
```

**Success Response** (HTTP 302 Redirect):
- Redirects to `/patient/register-waiting-verification`
- Verification email sent to provided email

**Error Response**:
- Validation errors shown in form
- Flash message with error details

---

#### 4. Waiting for Email Verification

```http
GET /patient/register-waiting-verification
Requires: auth.role:patient, auth.status:notverified
```

Shows page indicating email verification is pending.

**Response**: HTML view

---

#### 5. Resend Verification Email

```http
POST /patient/email-verify
Requires: auth.role:patient, auth.status:notverified
```

Sends verification email again.

**Success Response** (HTTP 302 Redirect):
- Message: "Verification email sent"

---

#### 6. Registration Step (Profiling)

```http
GET /patient/register-step
Requires: auth.role:patient, auth.status:verified
```

Shows profiling form (address, medical info, etc.).

**Response**: HTML form

---

#### 7. Submit Registration Step

```http
POST /patient/register-step
Requires: auth.role:patient, auth.status:verified
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "address": "123 Rue de Paris",
  "postal_code": "75001",
  "city": "Paris",
  "country": "France",
  "medical_conditions": "...",
  "allergies": "..."
}
```

**Success Response** (HTTP 302 Redirect):
- Account marked as profiled
- Redirects to patient dashboard

---

#### 8. Forgot Password

```http
GET /patient/forgot-password
```

Display forgot password form.

---

#### 9. Submit Forgot Password

```http
POST /patient/forgot-password
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "email": "patient@example.com"
}
```

**Success Response** (HTTP 302 Redirect):
- Email sent with password reset link
- Redirects to verification page

---

#### 10. Reset Password

```http
POST /patient/reset-password
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "token": "abc123xyz",
  "email": "patient@example.com",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}
```

**Success Response** (HTTP 302 Redirect):
- Password updated
- Redirects to login or success page

---

### PROFESSIONAL REGISTRATION

Similar structure to patient registration:
- `GET /pro/register` - Display form
- `POST /pro/register` - Submit registration
- `GET /pro/register-waiting-verification` - Wait for email verification
- `POST /pro/email-verify` - Resend verification
- `GET /pro/register-step` - Profiling form
- `POST /pro/register-step` - Submit profiling
- `GET /pro/register-completed` - Completion page
- `POST /pro/forgot-password` - Send reset link
- `POST /pro/reset-password` - Update password

Same request/response structures as patient registration.

---

## MESSAGING/CHAT ROUTES

### 1. Send Message

```http
POST /ajaxchat/sendmessage
Requires: auth.audya middleware
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "correspondent_id": "user_id_of_recipient",
  "conversation_id": "conversation_id (optional, creates new if omitted)",
  "subject": "Conversation subject/title",
  "message": "Message content",
  "files": [
    {
      "file": "base64_encoded_file_data or file upload",
      "name": "filename.pdf"
    }
  ]
}
```

**Success Response** (JSON HTTP 200):
```json
{
  "messages": [
    {
      "id": 1,
      "me": true,
      "user_name": "Dr. John",
      "textcontent": "Message content",
      "timetext": "2 min ago",
      "created_at": "2025-02-25 10:30:00",
      "files": []
    }
  ],
  "conversation_id": 123
}
```

**Error Response** (JSON HTTP 400):
```json
{
  "error": "Message cannot be empty"
}
```

---

### 2. Get Messages from Conversation

```http
GET /ajaxchat/getmessages/{conversation_id}
Requires: auth.audya middleware
```

**URL Parameters:**
- `conversation_id` (required): ID of conversation
- `lastid` (query param, optional): ID of last message (for pagination)

**Success Response** (JSON HTTP 200):
```json
{
  "messages": [
    {
      "id": 1,
      "me": false,
      "user_name": "Patient Name",
      "textcontent": "How are my medications?",
      "timetext": "1 hour ago",
      "created_at": "2025-02-25 09:30:00",
      "files": [
        {
          "id": 101,
          "name": "prescription.pdf",
          "url": "/file/101"
        }
      ]
    },
    {
      "id": 2,
      "me": true,
      "user_name": "Dr. John",
      "textcontent": "Everything looks good!",
      "timetext": "55 min ago",
      "created_at": "2025-02-25 09:35:00",
      "files": []
    }
  ]
}
```

---

### 3. Get All Conversations

```http
GET /ajaxchat/getconversations
Requires: auth.audya middleware
```

**Success Response** (JSON HTTP 200):
```json
{
  "conversations": [
    {
      "id": 1,
      "subject": "Follow-up appointment",
      "correspondent_id": 456,
      "correspondent_name": "Patient Name",
      "status": "pending",
      "last_message": "Confirmed for Tuesday",
      "last_message_at": "2025-02-25 10:00:00",
      "unread_count": 2,
      "users": [123, 456]
    }
  ],
  "contacts": [
    {
      "id": 456,
      "name": "Patient Name",
      "avatar": "/avatar/456.jpg",
      "status": "online"
    }
  ]
}
```

---

### 4. Get Contact Statuses

```http
GET /ajaxchat/ping
Requires: auth.audya middleware
```

Returns online/offline status for all contacts.

**Success Response** (JSON HTTP 200):
```json
{
  "user_123": "online",
  "user_456": "offline",
  "user_789": "away"
}
```

---

### 5. Set User Status

```http
POST /ajaxchat/setstatus
Requires: auth.audya middleware
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "value": "online"
}
```

Valid values: `online`, `offline`, `away`, `dnd` (do not disturb)

---

### 6. Set Conversation Status

```http
POST /ajaxchat/setconversationstatus/{conversation_id}
Requires: auth.audya middleware
```

**URL Parameters:**
- `conversation_id`: ID of conversation

**Request Body:**
```json
{
  "conversation_status": "finished"
}
```

Valid values: `pending`, `blocked`, `finished`

**Success Response** (JSON HTTP 200):
```json
{
  "newConversationStatus": "finished"
}
```

---

## DOCUMENT & FILE ROUTES

### 1. Download File

```http
GET /file/{response_id}
Requires: auth.audya middleware
```

Downloads a file attached to a form response.

**URL Parameters:**
- `response_id`: ID of the form response containing the file

**Success Response**: Binary file (application/pdf, image/jpeg, etc.)

**Error Response** (HTTP 403):
- Unauthorized - user doesn't have access to this file

---

### 2. Download Document

```http
GET /download/{id}
Requires: auth.audya middleware
```

Generic document download endpoint.

**URL Parameters:**
- `id`: Document ID

**Success Response**: Binary file

---

### 3. Download Medical Document

```http
GET /download-medical/{id}
Requires: auth.audya middleware
```

Download a medical document with access control.

**URL Parameters:**
- `id`: Medical document ID

**Access Control**:
- Patient can download their own documents
- Professional can download patient's documents if they have access

**Success Response**: Binary file (PDF, image, etc.)

**Error Response** (HTTP 403):
- Unauthorized access

---

### 4. Delete Medical Document

```http
GET /download-medical-delete/{id}
Requires: auth.audya middleware
```

Delete a medical document (soft delete).

**URL Parameters:**
- `id`: Medical document ID

**Success Response** (HTTP 302 Redirect):
- Document marked as deleted
- Redirects to previous page

---

### 5. View Medical Document Image

```http
GET /download-medical-image/{id}
Requires: auth.audya middleware
```

Display a medical document as an image in the browser.

**URL Parameters:**
- `id`: Medical document ID

**Success Response**: Image file (with proper MIME type)

---

### 6. Upload File

```http
POST /upload/{type}
Requires: auth.audya middleware
Content-Type: multipart/form-data
```

Upload a file to the system.

**URL Parameters:**
- `type`: Type of upload (document, image, medical, etc.)

**Request Body** (multipart/form-data):
```
file: <binary file data>
```

**Success Response** (JSON HTTP 200):
```json
{
  "success": true,
  "file_id": 12345,
  "filename": "scan.pdf",
  "path": "/storage/uploads/scan.pdf",
  "size": 2048576
}
```

**Error Response** (JSON HTTP 400):
```json
{
  "error": "File too large",
  "max_size": "10MB"
}
```

---

## REST API ROUTES

### 1. Get Current User

```http
GET /api/user
Requires: auth:sanctum middleware
```

Get information about the currently authenticated user.

**Success Response** (JSON HTTP 200):
```json
{
  "id": 123,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "account_type": "patient",
  "is_verified": true,
  "avatar": "https://...",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 2. Verify Professional Key

```http
POST /api/verify
Content-Type: application/json
```

Verify that a professional key exists (for external systems).

**Request Body:**
```json
{
  "pro_key": "unique_pro_key_string"
}
```

**Success Response** (JSON HTTP 200):
```json
{
  "count": 1
}
```

If key doesn't exist:
```json
{
  "count": 0
}
```

---

### 3. Get Patient Names by Professional Key

```http
POST /api/names
Content-Type: application/json
```

Get list of patients associated with a professional's API key.

**Request Body:**
```json
{
  "pro_key": "unique_pro_key_string"
}
```

**Success Response** (JSON HTTP 200):
```json
{
  "patient_456": "John Doe",
  "patient_789": "Jane Smith",
  "patient_101": "Bob Johnson"
}
```

---

### 4. Deliver Medical Document

```http
POST /api/deliver
Content-Type: multipart/form-data
```

External system endpoint to upload medical documents for patients (requires pro_key).

**Request Body** (multipart/form-data):
```
pro_key: unique_pro_key_string
patient_id: patient_456
doc_type: medical_record
name: patient_blood_work_2025.pdf
file: <binary file data>
```

**Success Response** (JSON HTTP 200):
```json
{
  "status": "success",
  "message": "Document uploaded successfully",
  "document_id": 54321,
  "filename": "patient_blood_work_2025.pdf"
}
```

**Error Response** (JSON HTTP 400):
```json
{
  "status": "denied",
  "message": "Professional key invalid"
}
```

or

```json
{
  "status": "denied",
  "message": "Patient not found"
}
```

---

## PROFESSIONAL ROUTES

### Profile Management

#### Get Profile

```http
GET /pro/my-profile
Requires: auth.role:pro, auth.status:profiled
```

View professional profile.

**Response**: HTML view

---

#### Update Profile

```http
POST /pro/update-profile
Requires: auth.role:pro, auth.status:profiled
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "first_name": "Jean",
  "last_name": "Dupont",
  "phone": "+33612345678",
  "bio": "Cardiologist specializing in...",
  "specialization": "Cardiology",
  "hospital": "Hospital Name"
}
```

**Success Response** (HTTP 302 Redirect):
- Flash message: "Profile updated successfully"

---

### Patient Management

#### List All Patients

```http
GET /pro/prosection/patients
Requires: auth.role:pro, auth.status:profiled
```

View all patients associated with this professional.

**Response**: HTML view with paginated patient list

---

#### View Patient Card

```http
GET /pro/prosection/patients/card/{patient_id}
Requires: auth.role:pro, auth.status:profiled
```

View detailed patient card with medical history, documents, etc.

**URL Parameters:**
- `patient_id`: ID of the patient

**Response**: HTML view

---

#### View Patient Devices

```http
GET /pro/prosection/patients/device/{patient_id}
Requires: auth.role:pro, auth.status:profiled
```

View all medical devices for a patient.

**URL Parameters:**
- `patient_id`: ID of the patient

**Response**: HTML view

**Returns:**
- Device list
- Device details and specifications
- Conformity declarations
- Medical documents related to devices

---

### Professional Contacts

#### List Professional Contacts

```http
GET /pro/prosection/procontacts
Requires: auth.role:pro, auth.status:profiled
```

View all professional contacts (other doctors, specialists).

**Response**: HTML view

---

#### Add Professional Contact

```http
POST /pro/prosection/procontacts/save-professional
Requires: auth.role:pro, auth.status:profiled
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "pro_id": 789
}
```

**Success Response** (HTTP 302 Redirect):
- Contact added
- Invitation sent

---

#### Delete Professional Contact

```http
POST /pro/prosection/procontacts/delete-professional
Requires: auth.role:pro, auth.status:profiled
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "pro_id": 789
}
```

**Success Response** (HTTP 302 Redirect):
- Contact removed

---

### Forms

#### Get Form for Patient

```http
GET /pro/form/{patient_id}/{form_slug}
Requires: auth.role:pro, auth.status:profiled
```

Display a form to fill out for a specific patient.

**URL Parameters:**
- `patient_id`: ID of the patient
- `form_slug`: Slug of the form (e.g., "crj7", "audiogram")

**Response**: HTML form

---

#### Submit Form

```http
POST /pro/form/{form_slug}/{patient_id}
Requires: auth.role:pro, auth.status:profiled
Content-Type: application/x-www-form-urlencoded
```

**URL Parameters:**
- `form_slug`: Slug of the form
- `patient_id`: ID of the patient

**Request Body**: Varies by form type

**Success Response** (HTTP 302 Redirect):
- Form saved
- Redirects to confirmation or patient card

---

#### Manual CRJ7 Submission

```http
POST /pro/manual_crj7
Requires: auth.role:pro, auth.status:profiled
Content-Type: application/json
```

Submit a manually filled CRJ7 form.

**Request Body:**
```json
{
  "patient_id": 456,
  "data": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

**Success Response** (JSON HTTP 200):
```json
{
  "success": true,
  "form_id": 12345
}
```

---

### Events/Appointments

#### Create Event

```http
POST /events
Requires: auth.audya middleware
Content-Type: application/json
```

Create a new event/appointment.

**Request Body:**
```json
{
  "name": "Follow-up consultation",
  "type": "consultation",
  "start": "2025-03-01 14:00:00",
  "end": "2025-03-01 15:00:00",
  "patient_id": 456,
  "location": "Room 101",
  "description": "Check-up and medication review"
}
```

**Success Response** (JSON HTTP 201):
```json
{
  "message": "Event created successfully",
  "event_id": 789
}
```

---

#### Get My Events

```http
GET /my-events
Requires: auth.audya middleware
```

Get all events for the authenticated user.

**Success Response** (JSON HTTP 200):
```json
{
  "events": [
    {
      "id": 1,
      "title": "Patient consultation",
      "type": "consultation",
      "start": "2025-02-25 10:00:00",
      "end": "2025-02-25 11:00:00",
      "patient_id": 456,
      "patient_name": "John Doe",
      "backgroundColor": "#3b82f6"
    }
  ]
}
```

---

#### Delete Event

```http
POST /events/delete
Requires: auth.audya middleware
Content-Type: application/json
```

**Request Body:**
```json
{
  "event_id": 1
}
```

**Success Response** (JSON HTTP 200):
```json
{
  "message": "Event deleted successfully"
}
```

---

### Dashboard & Statistics

#### Professional Dashboard

```http
GET /pro/dashboard
Requires: auth.role:pro, auth.status:profiled
```

View professional dashboard with statistics, recent activities, etc.

**Response**: HTML view

---

#### Statistics

```http
GET /pro/statistics
Requires: auth.role:pro
```

View detailed statistics about patients, activities, etc.

**Response**: HTML view

---

---

## PATIENT ROUTES

### Profile Management

#### Get Profile

```http
GET /patient/my-profile
Requires: auth.role:patient, auth.status:profiled
```

View patient profile.

**Response**: HTML view

---

#### Update Profile

```http
POST /patient/update-profile
Requires: auth.role:patient, auth.status:profiled
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "first_name": "Marie",
  "last_name": "Martin",
  "phone": "+33687654321",
  "birth_date": "1990-05-15",
  "avatar": "file upload (optional)"
}
```

**Success Response** (HTTP 302 Redirect):
- Profile updated

---

### Professional Management

#### List My Professionals

```http
GET /patient/professionals
Requires: auth.role:patient, auth.status:profiled
```

View all associated healthcare professionals.

**Response**: HTML view with professional list

---

#### Add Professional

```http
POST /patient/professionals/select-id/{professional_id}
Requires: auth.role:patient, auth.status:profiled
```

Add a professional to patient's care team.

**URL Parameters:**
- `professional_id`: ID of the professional to add

**Success Response** (HTTP 302 Redirect):
- Professional added

---

#### Remove Professional

```http
POST /patient/delete-professional
Requires: auth.role:patient, auth.status:verified
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "pro_id": 123
}
```

**Success Response** (HTTP 302 Redirect):
- Professional removed

---

### Medical Information

#### View Health Dashboard

```http
GET /patient/my-health
Requires: auth.role:patient, auth.status:profiled
```

View personal health information.

**Response**: HTML view

---

#### Update Medical Information

```http
POST /patient/update-medicals
Requires: auth.role:patient, auth.status:verified
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "allergies": "Penicillin",
  "medications": "Lisinopril 10mg daily",
  "medical_conditions": "Hypertension, Diabetes",
  "blood_type": "O+"
}
```

**Success Response** (HTTP 302 Redirect):
- Medical info updated

---

### Documents

#### Upload Document

```http
POST /patient/document-upload-self
Requires: auth.role:patient, auth.status:profiled
Content-Type: multipart/form-data
```

**Request Body** (multipart/form-data):
```
file: <binary file data>
document_type: medical_record (or prescription, lab_result, etc.)
```

**Success Response** (JSON HTTP 200):
```json
{
  "success": true,
  "document_id": 54321,
  "filename": "prescription.pdf"
}
```

---

#### Delete Document

```http
POST /patient/delete-document
Requires: auth.role:patient, auth.status:verified
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "doc_id": 123
}
```

**Success Response** (HTTP 302 Redirect):
- Document deleted (soft delete)

---

### Devices

#### View My Devices

```http
GET /patient/my-device
Requires: auth.role:patient, auth.status:profiled
```

View all medical devices associated with patient.

**Response**: HTML view

---

#### View Device Details

```http
GET /patient/my-device-details/{device_id}
Requires: auth.role:patient, auth.status:profiled
```

View detailed information about a specific device.

**URL Parameters:**
- `device_id`: ID of the device

**Response**: HTML view with device specifications, usage history, etc.

---

### Hearing Booklet

#### View Hearing Booklet

```http
GET /patient/my-hearing-booklet
Requires: auth.role:patient, auth.status:profiled
```

View hearing assessment booklet.

**Response**: HTML view

---

### Family Members

#### Add Family Member

```http
POST /patient/update-family-members
Requires: auth.role:patient, auth.status:profiled
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "relationship": "Daughter",
  "email": "jane@example.com",
  "birth_date": "2015-03-20"
}
```

**Success Response** (HTTP 302 Redirect):
- Family member added

---

#### Delete Family Member

```http
POST /patient/delete-family-members
Requires: auth.role:patient, auth.status:profiled
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```json
{
  "member_id": 789
}
```

**Success Response** (HTTP 302 Redirect):
- Family member deleted

---

### Dashboard

#### Patient Dashboard

```http
GET /patient/
GET /patient/dashboard
Requires: auth.role:patient, auth.status:profiled
```

View patient dashboard with appointments, messages, documents, etc.

**Response**: HTML view

---

---

## EVENT/APPOINTMENT ROUTES

### Create Event

```http
POST /events
Requires: auth.audya middleware
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Follow-up consultation",
  "type": "appointment",
  "start": "2025-03-15 14:00",
  "end": "2025-03-15 15:00",
  "patient": 456
}
```

**Success Response** (JSON HTTP 201):
```json
{
  "message": "Event created",
  "event_id": 100
}
```

---

### Get My Events

```http
GET /my-events
Requires: auth.audya middleware
```

**Success Response** (JSON HTTP 200):
```json
{
  "events": [
    {
      "id": 1,
      "title": "Audiogram test",
      "type": "test",
      "start": "2025-02-26 09:00",
      "end": "2025-02-26 09:30",
      "backgroundColor": "#10b981"
    }
  ]
}
```

---

### Delete Event

```http
POST /events/delete
Requires: auth.audya middleware
Content-Type: application/json
```

**Request Body:**
```json
{
  "event_id": 1
}
```

**Success Response** (JSON HTTP 200):
```json
{
  "message": "Event deleted"
}
```

---

## DEVICE MANAGEMENT ROUTES

### Get Device Information

```http
GET /ajaxdevicecard/getdevicesinformation/{patient_id}
Requires: auth.audya middleware
```

Get all device information for a patient.

**URL Parameters:**
- `patient_id`: ID of the patient

**Success Response** (JSON HTTP 200):
```json
{
  "devices": [
    {
      "id": 1,
      "name": "Hearing Aid Model X",
      "type": "Hearing Aid",
      "side": "bilateral",
      "model": "Model X-500",
      "brand": "Brand A"
    }
  ],
  "forms": [
    {
      "id": 101,
      "device_id": 1,
      "form_type": "CRJ7",
      "filled_at": "2025-02-20"
    }
  ],
  "documents": [
    {
      "id": 1001,
      "device_id": 1,
      "type": "prescription",
      "filename": "prescription.pdf"
    }
  ]
}
```

---

### Save New Device

```http
POST /ajaxdevicecard/savenewdevice
Requires: auth.audya middleware
Content-Type: application/json
```

**Request Body:**
```json
{
  "patient_id": 456,
  "device_name": "Hearing Aid Left",
  "side": "left",
  "type_id": 5,
  "brand": "Siemens",
  "model": "Signia IX",
  "serial": "SN123456"
}
```

**Success Response** (JSON HTTP 200):
```json
{
  "device": {
    "id": 2,
    "name": "Hearing Aid Left",
    "patient_id": 456,
    "created_at": "2025-02-25 11:30:00"
  }
}
```

---

### Save Conformity Declaration

```http
POST /ajaxdevicecard/saveconformity
Requires: auth.audya middleware
Content-Type: multipart/form-data
```

**Request Body** (multipart/form-data):
```
device_id: 1
patient_id: 456
prescription: <binary file>
conformity_date: 2025-02-25
notes: "Device working properly"
```

**Success Response** (JSON HTTP 200):
```json
{
  "success": true,
  "declaration_id": 501
}
```

---

### Generate Conformity PDF

```http
GET /ajaxdevicecard/generatepdf/{device_id}
Requires: auth.audya middleware
```

Generate PDF conformity declaration for a device.

**URL Parameters:**
- `device_id`: ID of the device

**Success Response**: ZIP file containing PDFs

**Content**: Conformity declaration documents

---

---

## RESPONSE FORMATS

### Success Responses

**JSON Success (HTTP 200):**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "key": "value"
  }
}
```

**HTML Redirect (HTTP 302):**
```
Location: /pro/dashboard
Set-Cookie: SESSIONID=xyz; Path=/; HttpOnly
```

**Flash Message** (in session):
```
success: "Profile updated successfully"
```

---

### Error Responses

**Validation Error (HTTP 422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

**Unauthorized (HTTP 401):**
```json
{
  "message": "Unauthenticated"
}
```

**Forbidden (HTTP 403):**
```json
{
  "message": "You do not have permission to access this resource"
}
```

**Not Found (HTTP 404):**
```json
{
  "message": "Resource not found"
}
```

**Server Error (HTTP 500):**
```json
{
  "message": "Internal server error"
}
```

---

## ERROR HANDLING

### Common Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 400 | Bad Request | Invalid request format |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Authentication Errors

```json
{
  "error": "The code is not valid",
  "attempts_remaining": 3
}
```

```json
{
  "error": "Too many attempts. Please request a new code.",
  "retry_after": 300
}
```

```json
{
  "error": "Code has expired"
}
```

---

## SECURITY CONSIDERATIONS

### Important Notes for Frontend Developers

⚠️ **Healthcare Data (HDS) Compliance**

This API handles sensitive healthcare data (HDS - Données de Santé) regulated by CNIL and ANSSI. Follow these security practices:

#### 1. **Authentication**
- Use session-based auth (cookies handled automatically)
- Implement 2FA code entry UI
- Display clear error messages on auth failure
- Never expose session IDs in URLs

#### 2. **Data Transmission**
- Always use HTTPS in production
- Never transmit passwords or 2FA codes unencrypted
- Validate SSL certificates (implement certificate pinning in mobile apps)

#### 3. **Storage**
- Never store sensitive data in localStorage (use sessionStorage for temporary data)
- Clear data on logout
- Use secure storage in mobile apps (Keychain iOS, Keystore Android)

#### 4. **User Input**
- Validate all inputs on frontend before sending
- Sanitize HTML to prevent XSS
- Use CSRF tokens for state-changing requests

#### 5. **Rate Limiting**
- Implement rate limiting on login attempts
- Add delay after failed 2FA attempts
- Don't retry automatically more than 5 times

#### 6. **Error Messages**
- Don't expose sensitive system errors to users
- Provide generic error messages (e.g., "Invalid credentials")
- Log detailed errors server-side only

#### 7. **File Uploads**
- Validate file types on frontend (and backend)
- Limit file sizes appropriately
- Scan files for malware
- Never execute uploaded files

#### 8. **Session Management**
- Implement automatic logout after 15 minutes of inactivity (HDS requirement)
- Warn user before timeout
- Clear session on logout
- Implement "remember me" safely (refresh tokens only)

#### 9. **Patient Privacy**
- Implement role-based UI (hide patient data from unauthorized users)
- Log all data access attempts
- Implement audit trails
- Follow GDPR/RGPD principles

#### 10. **Mobile-Specific**
- Implement certificate pinning
- Use secure network calls (TLS 1.3+)
- Store session tokens in device secure storage
- Implement background app timeout
- Clear sensitive data when app is backgrounded

---

### CNIL Compliance Checklist

- ✅ 2FA enabled for all logins
- ✅ HTTPS for all communication
- ⚠️ Session encryption (currently disabled - requires fix)
- ⚠️ Session timeout (currently 5000 min - should be 15 min)
- ✅ Role-based access control
- ⚠️ Audit logging (partial - needs improvement)
- ⚠️ Data encryption at rest (commented out - needs activation)
- ✅ SSL/TLS for SMTP
- ⚠️ Certificate pinning (not implemented on mobile)
- ⚠️ Device binding (not implemented)

---

## CONTACT & SUPPORT

**API Issues**: Contact development team
**Security Issues**: security@audya.com
**Support**: support@audya.com

---

**Version**: 1.0
**Last Updated**: 2025-02-25
**Next Review**: 2025-03-25
