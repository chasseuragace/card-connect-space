# Smart Business Card System - Project Documentation

## 1. Data Requirements Analysis

### Core Data Entities

**🏢 Company**
```json
{
  "id": "uuid",
  "name": "string",
  "location": "string", 
  "logo_url": "string",
  "theme_settings": {
    "primary_color": "string",
    "logo_position": "string"
  }
}
```

**👤 User Profile**
```json
{
  "id": "uuid",
  "company_id": "uuid",
  "name": "string",
  "position": "string",
  "email": "string",
  "phone": "string",
  "avatar_url": "string",
  "bio": "string",
  "qr_code_url": "string",
  "calendar_integration": {
    "google_calendar_id": "string",
    "show_public_events": "boolean"
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

**📅 Calendar Events** (Synced from Google)
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "google_event_id": "string",
  "title": "string",
  "location": "string",
  "start_time": "timestamp",
  "end_time": "timestamp",
  "is_public": "boolean",
  "is_confirmed_attendance": "boolean"
}
```

**🗓️ Booking Requests**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "requester_name": "string",
  "requester_email": "string",
  "requested_time": "timestamp",
  "duration_minutes": "number",
  "location_preference": "string",
  "note": "string",
  "status": "pending|confirmed|rejected",
  "created_at": "timestamp"
}
```

**👥 Teams**
```json
{
  "id": "uuid",
  "name": "string",
  "leader_id": "uuid",
  "company_id": "uuid",
  "created_at": "timestamp"
}
```

**🔗 Team Memberships**
```json
{
  "team_id": "uuid",
  "user_id": "uuid",
  "joined_at": "timestamp"
}
```

**💬 Anonymous Feedback**
```json
{
  "id": "uuid",
  "target_user_id": "uuid",
  "message": "string", // max 200 words
  "created_at": "timestamp"
}
```

## 2. Core Actions & Workflows

### Public Actions (QR Code Visitors)
- **View Profile** → Load user + company data
- **View Calendar Locations** → Show today's confirmed public events
- **Submit Booking Request** → Create pending booking
- **Browse Team** → Show team hierarchy
- **Send Anonymous Feedback** → Submit feedback for team members

### User Actions (Profile Owners)
- **Edit Profile** → Update personal information
- **Manage Calendar Settings** → Toggle event visibility
- **Review Booking Requests** → Confirm/reject pending bookings
- **Add to Google Calendar** → Export confirmed booking
- **Manage Teams** → Add/remove team members

### Admin Actions (Company Level)
- **Create User Profiles** → Onboard team members
- **Manage Company Settings** → Update branding/info

---

# Software Requirements Specification (SRS)

## 3. Functional Requirements

### FR-1: QR Code Landing Page
- **Mobile-first responsive design**
- Display user profile (name, position, company)
- Show real-time calendar locations
- Provide booking interface
- List team members with feedback counts

### FR-2: Calendar Integration
- Sync with Google Calendar API
- Display only confirmed public events
- Show location and time information
- Real-time updates of today's schedule

### FR-3: Booking System
- Time slot selection interface
- Visitor contact form (name, email, note)
- Pending status until owner confirmation
- Email notifications for new requests
- Owner can add confirmed bookings to Google Calendar

### FR-4: Team Management
- Hierarchical team structure
- Team members can edit own profiles
- Team browsing with member details
- Badge system showing feedback count

### FR-5: Anonymous Feedback
- 200-word limit enforcement
- Completely anonymous submission
- Counter badge on profiles
- No moderation system

## 4. Non-Functional Requirements

### Performance
- Page load time < 2 seconds on mobile
- Real-time calendar sync within 5 minutes
- Responsive design for all screen sizes

### Security
- Anonymous feedback truly untraceable
- Secure Google Calendar API integration
- User profile edit authentication

### Scalability
- Multi-company support
- Unlimited team hierarchy depth
- Efficient QR code generation

---

# Emotional Design Document

## 5. User Experience Goals

### The "Wow" Moment 🤩
When someone scans your QR code, they should think:
> *"This is incredibly professional and modern. This person is clearly tech-savvy and organized. I want to work with someone this innovative."*

### Emotional Journey

**📱 First Impression (0-3 seconds)**
- Instant load, beautiful design
- Clear professional identity
- "This person has their act together"

**🗺️ Discovery Phase (3-15 seconds)**
- Real calendar locations create urgency
- "They're actually nearby today!"
- Professional availability feels exclusive

**⏰ Engagement Phase (15-45 seconds)**
- Easy booking creates commitment
- Team browsing shows company scale
- Anonymous feedback adds intrigue

**🎯 Action Phase (45+ seconds)**
- Booking submission feels effortless
- Feedback submission feels safe
- Download CTA creates lasting connection

### Design Principles

**Professional Authority**
- Clean, minimal interface
- Subtle animations and transitions
- Premium color palette and typography

**Effortless Interaction**
- One-thumb navigation
- Clear call-to-action buttons
- Instant feedback on all actions

**Tech-Forward Innovation**
- Real-time data updates
- Smooth calendar integration
- Modern booking interface

**Trust & Reliability**
- Consistent branding
- Professional photography
- Clear contact information

### Success Metrics

**Immediate Impact**
- 90%+ of QR scans result in profile view completion
- 60%+ explore team members
- 30%+ submit booking requests

**Lasting Impression**
- "Professional" and "innovative" are top 2 words used to describe experience
- 70%+ download app after interaction
- 40%+ mention the card in follow-up conversations

This creates a system that transforms a simple business card exchange into a memorable, professional experience that positions you as a forward-thinking leader.