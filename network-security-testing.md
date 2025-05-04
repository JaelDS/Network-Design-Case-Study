# Network Security Testing Guide
## Comprehensive Validation Protocol for Critical Vulnerability Mitigation

<div align="center">

[![Testing Status](https://img.shields.io/badge/Testing-In%20Progress-yellow.svg)](#)
[![Packet Tracer](https://img.shields.io/badge/Platform-Cisco%20Packet%20Tracer-blue.svg)](#)
[![Security Level](https://img.shields.io/badge/Security-Enterprise-red.svg)](#)

</div>

## 📋 Table of Contents
- [Pre-Test Setup](#pre-test-setup)
- [Test 1: Heartbleed Vulnerability](#test-1-heartbleed-vulnerability)
- [Test 2: SQL Injection Prevention](#test-2-sql-injection-prevention)
- [Test 3: Man-in-the-Middle Attacks](#test-3-man-in-the-middle-attacks)
- [Test 4: Route Poisoning Prevention](#test-4-route-poisoning-prevention)
- [Test 5: Phishing Protection](#test-5-phishing-protection)
- [Test 6: Comprehensive Attack Simulation](#test-6-comprehensive-attack-simulation)
- [Test 7: Performance Impact](#test-7-performance-impact)
- [Test 8: Failover and Redundancy](#test-8-failover-and-redundancy)
- [Test Results Template](#test-results-template)
- [Troubleshooting Commands](#troubleshooting-commands)

## 🔧 Pre-Test Setup

### Environment Checklist
```
□ Open network topology in Packet Tracer
□ Verify all devices are powered on
□ Ensure all interfaces show green status
□ Enable simulation mode for packet tracking
□ Open CLI on all devices for monitoring
□ Prepare test documentation template
□ Configure screenshot capture tool
```

### Required Access Credentials
| Device | Username | Password | Enable Password | Console Password |
|--------|----------|----------|----------------|-------------------|
| Routers | admin | admin-password | cisco123 | ciscocon |
| Switches | admin | admin-password | cisco123 | ciscocon |
| ASA Firewall | admin | admin-password | cisco123 | ciscocon |
| AAA Server | admin | admin-password | - | ciscocon |

---

## Test 1: Heartbleed Vulnerability

### Test 1.1: Creating and Testing Malformed TLS Packets

**Objective**: Verify NGFW deep packet inspection capabilities against Heartbleed-style attacks

**Step 1: Prepare the Testing Environment**
```
1. Click on PC3
2. Go to Desktop > Command Prompt
3. Verify connectivity:
   ping 192.168.50.10
   (Should fail due to VLAN isolation)
```

**Step 2: Create Complex PDU for Heartbleed Simulation**
```
1. In Packet Tracer, click on "Add Complex PDU" (envelope with + icon)
2. Click on PC3 as source
3. Click on Database Server as destination
4. Configure PDU Settings:
   - Sequence Number: 1
   - One Shot Time: 0
   
5. Click "Advanced" tab
6. Configure:
   - Source Port: 55555
   - Destination Port: 443
   - Sequence Number: 1000
   - TCP Flags: Check SYN
   
7. Under "PDU Details":
   - Add custom data: "HEARTBEAT_REQUEST_OVERFLOW_64KB"
   - This simulates oversized heartbeat request
```

**Step 3: Run Simulation and Track Packet**
```
1. Switch to Simulation Mode (clock icon)
2. Click "Capture/Forward" button
3. Watch packet traverse through:
   PC3 → Switch0 → Router2 → Router1 → ASA Firewall
   
4. Expected Result: Packet dropped at ASA
5. Click on ASA device in simulation panel
6. Check "Processing" tab for drop reason
```

**Step 4: Verify Firewall Logs**
```
1. Click on ASA 5505
2. Go to CLI tab
3. Enter commands:
   enable
   cisco123
   show logging | include deny
   show access-list OUTSIDE_IN
```

**Expected Results**:
- Packet should be dropped at firewall
- Log entry showing denied traffic
- Access list hit count increases

---

## Test 2: SQL Injection Prevention

### Test 2.1: Database VLAN Isolation Verification

**Objective**: Confirm database server isolation from user networks

**Step 1: Test from User VLAN**
```
1. Click on PC0
2. Desktop > Command Prompt
3. Execute tests:
   ping 192.168.50.10
   (Expected: Request timed out)
   
   tracert 192.168.50.10
   (Expected: No route to host)
```

**Step 2: Create SQL Attack Simulation PDU**
```
1. Click "Add Complex PDU"
2. Source: PC1
3. Destination: Database Server
4. Configure:
   - Source Port: Random (50000)
   - Destination Port: 1433 (SQL)
   - TCP Flags: PSH, ACK
   
5. In PDU data field, enter:
   "'; DROP TABLE users; --"
```

**Step 3: Verify ACL Blocking**
```
1. On Router1 CLI:
   enable
   cisco123
   show access-lists 110
   (Note the hit count before test)
   
2. Run simulation with SQL PDU
3. Check ACL again:
   show access-lists 110
   (Hit count should increase for deny statement)
```

**Expected Results**:
- All user PCs unable to reach database directly
- ACL deny rule hit count increases
- Only authorized servers can access database

### Test 2.2: VLAN Configuration Verification

**Step 1: Check VLAN Setup**
```
1. On Switch 2960 (Database Switch):
   enable
   cisco123
   show vlan brief
   
   Expected output:
   VLAN Name                             Status    Ports
   ---- -------------------------------- --------- -------------------
   50   Database                         active    Fa0/2
   60   Management                       active    Fa0/1
```

**Step 2: Verify Port Security**
```
1. On Switch 2960:
   show port-security interface fastEthernet 0/2
   show port-security address
   
2. Note MAC address of Database server
3. Document security settings
```

---

## Test 3: Man-in-the-Middle Attacks

### Test 3.1: Port Security Testing

**Objective**: Validate port security prevents MAC flooding attacks

**Step 1: Configure Rogue Device**
```
1. Add new PC to topology (PC6)
2. Connect to empty port on Switch0
3. Configure IP: 192.168.20.200/24
4. Configure MAC: AA:BB:CC:DD:EE:FF
```

**Step 2: Test Port Security Violation**
```
1. On Switch0 (ML-Switch0):
   enable
   cisco123
   show port-security interface fa0/5
   
2. Connect PC6 to Fa0/5
3. From PC6, ping any device
4. Check switch:
   show port-security
   show interface fa0/5
   (Should show err-disabled)
```

**Expected Results**:
- Port enters err-disabled state
- Security violation logged
- Traffic from rogue device blocked

### Test 3.2: DHCP Snooping Test

**Step 1: Create Rogue DHCP Server**
```
1. Click on PC4
2. Go to Services > DHCP
3. Configure:
   - Default Gateway: 192.168.20.254
   - DNS Server: 8.8.8.8
   - Start IP: 192.168.20.100
   - Subnet Mask: 255.255.255.0
4. Turn ON DHCP service
```

**Step 2: Test DHCP Snooping**
```
1. On Switch0:
   show ip dhcp snooping
   show ip dhcp snooping binding
   
2. From a new PC, request DHCP
3. Verify only legitimate DHCP works
4. Check logs:
   show logging | include DHCP
```

**Expected Results**:
- Rogue DHCP offers blocked
- Only trusted ports allow DHCP server messages
- Legitimate DHCP continues to function

### Test 3.3: Dynamic ARP Inspection

**Step 1: Create ARP Poison Packet**
```
1. Use Complex PDU
2. Create custom ARP packet:
   - Source MAC: AA:AA:AA:AA:AA:AA
   - Source IP: 192.168.20.1 (Gateway IP)
   - Target: Broadcast
   - Operation: ARP Reply
```

**Step 2: Verify DAI Protection**
```
1. On Switch0:
   show ip arp inspection statistics
   show ip arp inspection interfaces
   
2. Send ARP poison packet
3. Check statistics again:
   show ip arp inspection statistics
   (Dropped packets should increase)
```

**Expected Results**:
- Invalid ARP packets dropped
- DAI statistics show drops
- Legitimate ARP traffic continues

---

## Test 4: Route Poisoning Prevention

### Test 4.1: RIP Authentication Testing

**Objective**: Verify routing protocol security prevents unauthorized updates

**Step 1: Verify Current Routes**
```
1. On Router1:
   show ip route
   show ip protocols
   show ip rip database
```

**Step 2: Attempt Rogue Route Injection**
```
1. Create Complex PDU:
   - Source: PC3
   - Destination: 224.0.0.9 (RIP multicast)
   - UDP Port: 520
   - Data: RIP route advertisement
```

**Step 3: Verify ACL Protection**
```
1. On Router1:
   show access-lists 101
   (Note hit counts)
   
2. Send rogue RIP packet
3. Check ACL again:
   show access-lists 101
   (Deny count should increase)
   
4. Verify routes unchanged:
   show ip route
```

**Expected Results**:
- Rogue routing updates blocked
- Routing table remains stable
- ACL logs show blocked attempts

### Test 4.2: OSPF Authentication Test

**Step 1: Check OSPF Status**
```
1. On Router1:
   show ip ospf neighbor
   show ip ospf interface
```

**Step 2: Test Unauthenticated OSPF**
```
1. Add test router to topology
2. Configure OSPF without authentication
3. Try to form adjacency
4. Check Router1:
   debug ip ospf adj
   (Should show authentication failures)
```

**Expected Results**:
- Unauthenticated OSPF rejected
- No unauthorized adjacencies formed
- Authentication failures logged

---

## Test 5: Phishing Protection

### Test 5.1: AAA Server Authentication

**Objective**: Test centralized authentication and logging

**Step 1: Configure Test Credentials**
```
1. Click on AAA Server
2. Services > AAA
3. Add users:
   - Username: testuser
   - Password: cisco123
   - Username: hacker
   - Password: badpass
```

**Step 2: Test Failed Authentication**
```
1. On PC5:
   - Open web browser
   - Navigate to internal resource
   - Use credentials: hacker/wrongpass
   
2. On AAA Server:
   - Check Services > Syslog
   - Look for failed authentication logs
```

**Step 3: Test Successful Authentication**
```
1. Use correct credentials: testuser/cisco123
2. Verify access granted
3. Check AAA logs for successful auth
```

**Expected Results**:
- Failed logins logged with details
- Successful authentication works
- All attempts tracked centrally

### Test 5.2: 802.1X Port Authentication

**Step 1: Configure 802.1X on Test Port**
```
1. On Switch0:
   configure terminal
   interface fa0/10
   dot1x port-control auto
   exit
```

**Step 2: Test Unauthorized Access**
```
1. Connect new PC to Fa0/10
2. Try to ping any device
3. Should fail - port unauthorized
4. Check status:
   show dot1x interface fa0/10
```

**Step 3: Configure and Test 802.1X Client**
```
1. On test PC:
   - Go to Config tab
   - Set 802.1X credentials
   - Username: testuser
   - Password: cisco123
   
2. Reconnect to port
3. Verify authentication:
   show dot1x interface fa0/10
```

**Expected Results**:
- Unauthenticated devices blocked
- 802.1X authentication successful
- Port state changes tracked

---

## Test 6: Comprehensive Attack Simulation

### Test 6.1: Multi-Vector Attack Scenario

**Objective**: Test defense-in-depth against simultaneous attacks

**Step 1: Setup Attack Sequence**
```
1. Create multiple Complex PDUs:
   PDU1: SQL injection attempt
   PDU2: Heartbleed simulation
   PDU3: ARP poison
   PDU4: Rogue DHCP
   PDU5: Unauthorized routing update
```

**Step 2: Configure Timing**
```
1. Set PDU timing:
   PDU1: Time 0
   PDU2: Time 5
   PDU3: Time 10
   PDU4: Time 15
   PDU5: Time 20
```

**Step 3: Run Simulation**
```
1. Start simulation mode
2. Set event filters (all protocols)
3. Run auto capture
4. Document each security control activation
```

**Step 4: Analyze Results**
```
1. For each attack vector:
   - Where was it blocked?
   - Which security feature activated?
   - Were there any alerts generated?
   
2. Export simulation results
3. Create attack timeline diagram
```

**Expected Results**:
- All attack vectors blocked
- Multiple security layers engaged
- No successful penetration

---

## Test 7: Performance Impact

### Test 7.1: Baseline Performance Test

**Objective**: Measure security overhead on network performance

**Step 1: Disable Security Features**
```
1. On ASA:
   configure terminal
   no access-list OUTSIDE_IN
   
2. On Switches:
   no ip dhcp snooping
   no ip arp inspection
```

**Step 2: Run Baseline Tests**
```
1. From PC0 to PC3:
   ping 192.168.20.103 -n 100
   Record: Average time, packet loss
   
2. Create large file transfer PDU
3. Measure transfer time
```

**Step 3: Enable Security and Retest**
```
1. Re-enable all security features
2. Repeat same tests
3. Calculate performance delta:
   Delta = (Secured_Time - Baseline_Time) / Baseline_Time * 100
```

**Expected Results**:
- Document latency increase (expected: 10-15%)
- Throughput impact (expected: 5-10%)
- All security features remain active

---

## Test 8: Failover and Redundancy

### Test 8.1: Link Failure Simulation

**Objective**: Verify security maintained during network failover

**Step 1: Document Current Path**
```
1. From PC0:
   tracert 192.168.1.1
   Document the path taken
```

**Step 2: Simulate Link Failure**
```
1. Click on link between Router1 and Router2
2. Select "Delete" or click the X
3. Wait for OSPF convergence (30-60 seconds)
```

**Step 3: Verify Alternate Path**
```
1. Repeat tracert
2. Verify traffic now goes through Router3
3. Test all security features on new path
```

**Step 4: Restore and Verify**
```
1. Re-add the link
2. Wait for reconvergence
3. Verify optimal path restored
```

**Expected Results**:
- Automatic failover successful
- Security controls remain active
- No security gaps during transition

---

## 📋 Test Results Template

```markdown
===========================================
Test Case ID: [TEST-XXX]
Date: [MM/DD/YYYY]
Tester: [Name]
===========================================

OBJECTIVE:
[Clear description of what is being tested]

PRE-CONDITIONS:
- Device: [Device name]
- Initial State: [Description]
- Required Config: [Any specific setup]

TEST STEPS:
1. [Detailed step with exact commands]
   Command: [exact CLI command]
   Expected: [expected output]
   Actual: [actual output]
   Screenshot: [filename]

2. [Next step...]

RESULTS:
□ PASS / □ FAIL

ISSUES FOUND:
- [Issue 1]
- [Issue 2]

RECOMMENDATIONS:
- [Recommendation 1]
- [Recommendation 2]

SCREENSHOTS:
[List of screenshot files]
===========================================
```

---

## 🔍 Troubleshooting Commands

### General Status Commands
```cisco
show running-config
show startup-config
show ip interface brief
show interface status
```

### Security Feature Commands
```cisco
! Port Security
show port-security
show port-security interface [interface]
show port-security address

! 802.1X
show dot1x all
show dot1x interface [interface]

! DHCP Snooping
show ip dhcp snooping
show ip dhcp snooping binding

! Dynamic ARP Inspection
show ip arp inspection
show ip arp inspection statistics

! Access Control Lists
show access-lists
show ip access-lists [number]
```

### Routing Commands
```cisco
show ip route
show ip protocols
show ip ospf neighbor
show ip ospf interface
show ip rip database
```

### AAA Commands
```cisco
show aaa servers
show aaa sessions
show tacacs
show radius statistics
```

### Firewall Commands
```cisco
show conn
show xlate
show access-list
show logging
show interface ip brief
```

### Debug Commands (Use with Caution)
```cisco
debug ip packet
debug ip ospf adj
debug dot1x all
debug aaa authentication
debug ip dhcp snooping
```

---

## 📊 Test Summary Dashboard

| Test Category | Tests Planned | Tests Completed | Pass Rate | Critical Issues |
|--------------|---------------|-----------------|-----------|-----------------|
| Heartbleed | 4 | 0 | 0% | 0 |
| SQL Injection | 5 | 0 | 0% | 0 |
| MITM | 6 | 0 | 0% | 0 |
| Route Poisoning | 4 | 0 | 0% | 0 |
| Phishing | 5 | 0 | 0% | 0 |
| Performance | 3 | 0 | 0% | 0 |
| Failover | 3 | 0 | 0% | 0 |
| **TOTAL** | **30** | **0** | **0%** | **0** |

---

<div align="center">

### 🔒 Security Testing Protocol
*Comprehensive validation for enterprise network protection*

**Developed by**  
@JaelDS & @cyrusmokua

[![Documentation](https://img.shields.io/badge/Docs-Complete-green.svg)](#)
[![Tests](https://img.shields.io/badge/Tests-Ready-blue.svg)](#)
[![Status](https://img.shields.io/badge/Status-In%20Progress-yellow.svg)](#)

</div>
