# 🏥 Hospital Portal - Complete Feature Guide

## 🎯 Quick Start

### Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Receptionist** | `receptionist@hospital.com` | `password123` |
| **Doctor** | `doctor@hospital.com` | `password123` |
| **Admin** | `admin@hospital.com` | `password123` |

### Running the Application

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📋 Core Features

### 1. 🗓️ Appointment Management

#### For Reception
- **Create Appointments**
  - Select patient from existing list
  - Assign to available doctor
  - Set date and time
  - Specify appointment type (consultation, follow-up, emergency)
  - Add visit reason
  - Include internal notes

- **Manage All Appointments**
  - View appointments across all doctors
  - Filter by:
    - Status (pending, confirmed, completed, cancelled)
    - Doctor
    - Date
    - Search by patient name
  - Edit appointment details
  - Cancel with reason tracking

#### For Doctors
- **View Personal Schedule**
  - See only your assigned appointments
  - Filter by status and date
  - List or calendar view

- **Appointment Actions**
  - **Accept** pending appointments
  - **Reschedule** to new date/time
  - **Cancel** with reason
  - Quick message reception about appointments

### 2. 📅 Calendar View

#### Features
- **Toggle Views**: Switch between List ↔ Calendar
- **Week View**: See appointments across 7 days
- **Day View**: Detailed hour-by-hour schedule
- **Color Coding**:
  - 🟡 **Pending** (Amber) - Awaiting doctor confirmation
  - 🔵 **Confirmed** (Blue) - Accepted by doctor
  - 🟢 **Completed** (Green) - Appointment finished
  - 🔴 **Cancelled** (Red) - Appointment cancelled

#### Doctor Filtering
- **Receptionists**: Filter calendar by specific doctor or view all
- **Doctors**: Automatically filtered to show only their appointments

#### Time Range
- 7:00 AM to 8:00 PM
- 30-minute time slots
- Current time indicator

### 3. 💬 Internal Messaging

#### Communication Channels
- **Doctor ↔ Reception** direct messaging
- **Real-time style interface**
- **Read receipts** with timestamps

#### Message Categories
1. **General** - Regular communication
2. **Appointment** - Related to specific appointments
3. **Urgent** - Requires immediate attention

#### Key Features
- **Conversation Threading**: All messages with a person grouped together
- **Unread Counts**: Badge showing unread messages
- **Search**: Find conversations quickly
- **Appointment Linking**: Connect messages to specific appointments
- **Quick Access**: Message from appointment details

#### Use Cases
- "Patient running 15 minutes late"
- "Doctor available earlier for next appointment"
- "Room change for afternoon session"
- "Lab results ready for patient review"

### 4. 👥 User Management (Admin Only)

#### Admin Dashboard
- **User Statistics**
  - Total users count
  - Doctors count
  - Receptionists count
  - Administrators count

#### User Operations
- **Create New Users**
  - Set name and email
  - Assign role (receptionist, doctor, admin)
  - Assign department
  - Add specialization (for doctors)

- **Edit Users**
  - Update user details
  - Change roles
  - Modify department/specialization

- **Delete Users**
  - Remove users from system
  - Confirmation required

#### Search & Filter
- Search by name or email
- Filter by role
- View all user details in table

---

## 🎨 UI/UX Features

### Visual Design
- ✅ **Modern Interface**: Clean, professional design
- ✅ **Color-coded Status**: Quick visual recognition
- ✅ **Icon System**: Intuitive icons throughout
- ✅ **Responsive**: Works on desktop and tablet
- ✅ **Loading States**: Clear feedback during operations
- ✅ **Empty States**: Helpful messages when no data

### User Experience
- ✅ **Quick Filters**: Instant filtering and search
- ✅ **Keyboard Shortcuts**: Enter to send messages
- ✅ **Hover Effects**: Interactive feedback
- ✅ **Confirmation Dialogs**: Prevent accidental actions
- ✅ **Toast Notifications**: Success/error alerts
- ✅ **Role-based UI**: Only show relevant actions

---

## 🔐 Role-Based Access

### Receptionist Permissions
- ✅ Create/edit/cancel appointments
- ✅ View all appointments
- ✅ Filter by doctor
- ✅ Message all doctors
- ✅ Access appointment calendar
- ❌ Cannot access user management

### Doctor Permissions
- ✅ View personal schedule
- ✅ Accept pending appointments
- ✅ Reschedule own appointments
- ✅ Cancel appointments
- ✅ Message reception
- ✅ Access personal calendar
- ❌ Cannot create new appointments
- ❌ Cannot view other doctors' appointments
- ❌ Cannot access user management

### Admin Permissions
- ✅ Full user management
- ✅ Create/edit/delete users
- ✅ Assign roles
- ✅ View system statistics
- ✅ Manage permissions

---

## 📊 Appointment Statuses

### Status Flow

```
Pending → Confirmed → Completed
   ↓
Cancelled
```

### Status Definitions

- **Pending**: Appointment created by reception, awaiting doctor confirmation
- **Confirmed**: Doctor has accepted the appointment
- **Completed**: Appointment finished
- **Cancelled**: Appointment cancelled by doctor or reception

### Status Actions

| Status | Reception Can | Doctor Can |
|--------|---------------|------------|
| **Pending** | Edit, Cancel | Accept, Reschedule, Cancel |
| **Confirmed** | Edit, Cancel | Reschedule, Cancel |
| **Completed** | View | View |
| **Cancelled** | View | View |

---

## 💡 Common Workflows

### Creating an Appointment (Reception)
1. Navigate to **Appointments**
2. Click **"New Appointment"**
3. Select **patient** from dropdown
4. Choose **doctor** (with specialization shown)
5. Set **date and time**
6. Select **appointment type**
7. Add **visit reason** (e.g., "Annual checkup")
8. Include **internal notes** if needed
9. Click **"Create Appointment"**
10. Appointment created with **"Pending" status**

### Doctor Accepting Appointment
1. Login as doctor
2. View **"Today"** or **"Upcoming"** appointments
3. See appointments with **"Pending"** status
4. Click **"Accept"** button
5. Status changes to **"Confirmed"**

### Rescheduling an Appointment
1. Find the appointment
2. Click **"Reschedule"**
3. Select **new date** and **time**
4. Click **"Reschedule"**
5. Status resets to **"Pending"**

### Sending Urgent Message
1. Navigate to **Messages**
2. Click **"+"** to create new message
3. Select **recipient**
4. Choose **"Urgent"** category
5. Optionally link to **appointment**
6. Type **message**
7. Click **"Send Message"**
8. Recipient sees **urgent badge**

### Using Calendar View
1. Navigate to **Appointments**
2. Click **"Calendar"** toggle
3. Choose **Week** or **Day** view
4. Filter by **doctor** (if reception)
5. Click on **event** to see details
6. Use **prev/next** buttons to navigate dates

---

## 🎯 Key Benefits

### Reduces
- ❌ Phone calls back and forth
- ❌ WhatsApp messages
- ❌ Paper diaries
- ❌ Confusion about schedules
- ❌ Double bookings

### Improves
- ✅ Communication efficiency
- ✅ Schedule visibility
- ✅ Appointment tracking
- ✅ Team coordination
- ✅ Patient experience

---

## 🔧 Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Calendar**: FullCalendar React
- **Icons**: Lucide React
- **State**: React Hooks

---

## 📦 Mock Data

### Users
- **Doctors**: Dr. Michael Chen, Dr. Sarah Williams, Dr. James Brown
- **Reception**: Sarah Johnson, Emma Davis
- **Admin**: Admin User

### Appointments
- 6 sample appointments with various statuses
- Different types and reasons
- Spread across multiple dates

### Messages
- 6 sample messages
- Different categories
- Some linked to appointments

---

## 🚀 Next Steps (Phase 3+)

### Potential Enhancements
- [ ] Drag-and-drop calendar rescheduling
- [ ] Real-time WebSocket messaging
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Patient portal access
- [ ] Doctor availability management
- [ ] Recurring appointments
- [ ] Waiting room check-in
- [ ] File attachments in messages
- [ ] Analytics dashboard
- [ ] Export to PDF/CSV
- [ ] Mobile app

---

## 📝 Notes

- All data is currently mock data (in-memory)
- Requires database integration for production
- Authentication is simulated
- Refresh page to see updates (no real-time sync yet)

---

## 🐛 Troubleshooting

### Calendar Not Showing
- Ensure FullCalendar packages are installed
- Check console for errors
- Refresh the page

### Messages Not Sending
- Currently shows alerts (not persisted)
- Requires backend API for real implementation

### Can't Create Appointment
- Ensure you're logged in as reception
- Check all required fields are filled
- Patient and doctor must be selected

---

**For more details, see `IMPLEMENTATION_SUMMARY.md`**
