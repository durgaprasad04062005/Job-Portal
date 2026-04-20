# Running Job Portal in Eclipse Enterprise (JEE 2025-12)

## Prerequisites Already Confirmed
- ✅ Eclipse IDE for Enterprise Java (JEE 2025-12) at `%USERPROFILE%\eclipse\jee-2025-12`
- ✅ Java 17 at `C:\Program Files\Java\jdk-17`
- ✅ MongoDB 8.2 running on `localhost:27017` (no auth)

---

## Step 1 — Install Lombok in Eclipse (ONE-TIME SETUP)

Lombok must be installed as an Eclipse agent or it won't process `@Data`, `@Builder`, etc.

1. Download Lombok JAR:
   - Go to https://projectlombok.org/download
   - Download `lombok.jar`

2. Install it:
   - Double-click `lombok.jar` — the installer opens
   - Click **"Specify location"** → browse to:
     `C:\Users\Admin\eclipse\jee-2025-12\eclipse\eclipse.exe`
   - Click **Install / Update**
   - Click **Quit Installer**

3. Restart Eclipse

> **Alternative (no installer):** Add this line to `eclipse.ini` manually:
> ```
> -javaagent:C:/path/to/lombok.jar
> ```

---

## Step 2 — Install Spring Tools 4 (STS4) Plugin

Spring Tools gives you Spring Boot run configs, live beans view, etc.

1. In Eclipse: **Help → Eclipse Marketplace**
2. Search: `Spring Tools`
3. Install **Spring Tools 4 (aka Spring Tool Suite 4)**
4. Restart Eclipse when prompted

---

## Step 3 — Import the Project

1. **File → Import → Maven → Existing Maven Projects**
2. Browse to the `job-portal` folder (where `pom.xml` is)
3. Check `job-portal-backend` is selected
4. Click **Finish**

Eclipse will download all Maven dependencies automatically (~2-3 minutes first time).

---

## Step 4 — Configure JRE

1. **Window → Preferences → Java → Installed JREs**
2. Click **Add → Standard VM**
3. Set JRE Home: `C:\Program Files\Java\jdk-17`
4. Click **Finish** → check it as default → **Apply and Close**

---

## Step 5 — Enable Annotation Processing (for Lombok)

1. Right-click project → **Properties**
2. Go to **Java Compiler → Annotation Processing**
3. Check **Enable annotation processing**
4. Check **Enable processing in editor**
5. Click **Apply** → rebuild when prompted

---

## Step 6 — Run the Application

### Option A — Spring Boot Dashboard (recommended with STS4)
1. Open **Spring Boot Dashboard** (Window → Show View → Other → Spring → Spring Boot Dashboard)
2. Your app `job-portal-backend` appears
3. Click the ▶ (Run) button

### Option B — Run As Spring Boot App
1. Open `src/main/java/com/jobportal/JobPortalApplication.java`
2. Right-click → **Run As → Spring Boot App**

### Option C — Run As Java Application
1. Open `JobPortalApplication.java`
2. Right-click → **Run As → Java Application**

---

## Step 7 — Verify It's Running

Open your browser and go to:
```
http://localhost:8080/api/auth/login
```
You should see a JSON response (405 Method Not Allowed is fine — it means the server is up).

Check the Eclipse Console for:
```
Started JobPortalApplication in X.XXX seconds
```

---

## MongoDB Connection

Your MongoDB is already running. The app connects to:
- **Host:** localhost
- **Port:** 27017
- **Database:** `jobportal` (created automatically on first run)
- **Auth:** None required

Sample data (3 users + 4 jobs) is auto-seeded on first startup.

**Demo accounts:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jobportal.com | Admin@123 |
| Employer | employer@techcorp.com | Employer@123 |
| Student | student@example.com | Student@123 |

---

## Step 8 — Run the Frontend

Open a separate terminal (CMD or PowerShell):
```cmd
cd job-portal\frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:3000

---

## Troubleshooting

### "The import lombok cannot be resolved"
→ Lombok is not installed in Eclipse. Follow Step 1 above.

### "Project facet Java 17 is not supported"
→ Follow Step 4 to add Java 17 JRE.

### Red errors on `@Data`, `@Builder`, `@Slf4j`
→ Annotation processing is disabled. Follow Step 5.

### "Port 8080 already in use"
→ Another process is using 8080. Either stop it or change `server.port` in `application.yml`.

### MongoDB connection refused
→ MongoDB is not running. Start it:
```cmd
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --config "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg"
```

### Hot reload not working
→ In Eclipse: **Project → Build Automatically** must be checked.
→ DevTools is included in pom.xml and enabled in application.yml.
