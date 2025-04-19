# Network Security Testing and Validation

## Table of Contents

- [1. Basic Connectivity Testing](#1-basic-connectivity-testing)
- [2. Security Feature Testing](#2-security-feature-testing)
- [3. Comprehensive Security Validation](#3-comprehensive-security-validation)
- [4. Performance Testing](#4-performance-testing)
- [5. References](#references)

This document provides a systematic approach to testing and validating the security implementations in our network environment. Each test includes step-by-step procedures and spaces for documenting evidence. The testing methodology follows industry best practices from NIST SP 800-115 (Technical Guide to Information Security Testing and Assessment) and the OSSTMM (Open Source Security Testing Methodology Manual).

## 1. Basic Connectivity Testing

### 1.1 Test Internal Network Connectivity

#### 1.1.1 Router0 to AAA Server Testing
- Connect to Router0 via console
- Enter: `ping 192.168.1.2`
- Verify successful pings with reply messages
- Enter: `traceroute 192.168.1.2`
- Verify direct path with one hop

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### 1.1.2 Switch0 to ASA Firewall Testing
- Connect to Switch0 via console
- Enter: `ping 192.168.9.254`
- Verify successful pings with reply messages

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### 1.1.3 ASA Firewall to Internet Testing
- Connect to ASA via console
- Enter: `ping 8.8.8.8`
- Verify successful pings to external networks
- Enter: `show xlate`
- Verify NAT translations are occurring

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### 1.1.4 Router0 to Router1 Testing
- Connect to Router0 via console
- Enter: `ping 192.168.10.2`
- Verify successful pings with reply messages
- Enter: `show ip route 192.168.10.2`
- Verify route exists in routing table as directly connected

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### 1.1.5 Router0 to Router2 Testing
- Connect to Router0 via console
- Enter: `ping 172.16.12.2`
- Verify successful pings with reply messages
- Enter: `show ip route 172.16.12.2`
- Verify route exists in routing table as directly connected

**Evidence:**
```
[Insert screenshot or terminal output here]
```

### 1.2 Test Cross-Router Connectivity

#### 1.2.1 Router1 to Router2 Network Testing
- Connect to Router1 via console
- Enter: `ping 10.10.10.1`
- Verify successful pings with reply messages
- Enter: `traceroute 10.10.10.1`
- Verify path traverses through Router0 to Router2
- Enter: `show ip route 10.10.10.0`
- Verify route exists learned via RIP

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### 1.2.2 Router2 to Router1 Network Testing
- Connect to Router2 via console
- Enter: `ping 172.16.10.1`
- Verify successful pings with reply messages 
- Enter: `traceroute 172.16.10.1`
- Verify path traverses through Router0 to Router1
- Enter: `show ip route 172.16.10.0`
- Verify route exists learned via RIP

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### 1.2.3 End-to-End PC Connectivity
- From PC0 (Multilayer Switch2), open command prompt
- Enter: `ping 10.10.10.2`
- Verify successful ping to PC3 on Router2's network
- Enter: `tracert 10.10.10.2`
- Verify path traverses correct routers
- Repeat from other PCs to confirm cross-network connectivity

**Evidence:**
```
[Insert screenshot or terminal output here]
```

### 1.3 Test Database Server Connectivity

#### 1.3.1 Authorized Access Testing
- From PC0 (Multilayer Switch2), open command prompt
- Enter: `ping 192.168.50.10`
- Verify ping fails due to security restrictions
- From Database management station (if configured), try:
- Enter: `ping 192.168.50.10`
- Verify successful ping

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### 1.3.2 Protocol-Specific Access
- From authorized management station
- Test database connection using SQL client application
- Verify connection succeeds on port 1433
- Test other protocols and verify they're blocked

**Evidence:**
```
[Insert screenshot or terminal output here]
```

### 1.4 Test External Connectivity

#### 1.4.1 Internal to External Testing
- From PC0 (Multilayer Switch2), open command prompt
- Enter: `ping 8.8.8.8`
- Verify ping is successful through ASA
- Enter: `tracert 8.8.8.8`
- Verify traffic traverses through Router1, Router0, and ASA

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### 1.4.2 NAT Verification
- Connect to ASA via console
- Enter: `show xlate`
- Verify NAT translations exist for internal hosts
- Enter: `show conn count`
- Verify active connections through firewall

**Evidence:**
```
[Insert screenshot or terminal output here]
```

## 2. Security Feature Testing

### 2.1 Router Security Testing

#### 2.1.1 Test SSH Access Security

##### SSH Authentication Testing
- From management PC, initiate SSH connection to Router0:
- Enter: `ssh admin@192.168.1.1`
- Try incorrect password, verify access is denied
- Try correct password, verify access is granted
- Verify session is encrypted using Wireshark (if available)

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### AAA Authentication Testing
- Connect to Router0 via SSH
- Enter incorrect credentials, verify access is denied
- Enter correct credentials, verify access is granted
- On Router0, enter: `show aaa sessions`
- Verify authentication occurred via AAA server

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### Local Authentication Failover
- Disconnect AAA server temporarily
- Attempt SSH login to Router0
- Verify login succeeds with local credentials
- Reconnect AAA server
- Verify authentication returns to using AAA server

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### 2.1.2 Test RIP Authentication (Route Poisoning Mitigation)

##### RIP Authentication Verification
- Connect to Router0 via console
- Enter: `debug ip rip events`
- Observe RIP updates being authenticated
- Enter: `show ip protocols`
- Verify RIP is configured with authentication
- Enter: `show key chain`
- Verify key chain configuration

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### Route Table Verification
- On all routers, enter: `show ip route`
- Verify all expected networks appear in routing tables
- Verify no unexpected routes are present
- Enter: `debug ip routing`
- Observe route updates being processed

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### Unauthorized Route Test (If Environment Permits)
- Attempt to inject unauthorized route
- Verify route is rejected due to authentication failure

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### 2.1.3 Test ACL Functionality

##### Router0 ACL Testing
- Connect to Router0 via console
- Enter: `show access-lists`
- Verify ACLs are configured correctly
- Enter: `show ip interface | include access list`
- Verify ACLs are applied to correct interfaces
- Enter: `show access-lists | include matches`
- Verify hit counts on ACL entries

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### AAA Server Protection Testing
- From unauthorized source, attempt to reach AAA server
- Verify connection is blocked
- Check Router0 logs for denied packets:
- Enter: `show logging | include denied`

**Evidence:**
```
[Insert screenshot or terminal output here]
```

### 2.2 Switch Security Testing

#### 2.2.1 Test Port Security (MITM Mitigation)

##### Multilayer Switch0 Port Security Testing
- Connect to Multilayer Switch0 via console
- Enter: `show port-security`
- Verify port security is enabled on appropriate ports
- Enter: `show port-security address`
- Verify MAC addresses are learned/configured

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### Port Security Violation Testing
- Connect unauthorized device to secured port (e.g., FastEthernet0/4)
- On Multilayer Switch0, enter: `show port-security interface fastEthernet 0/4`
- Verify security violation counter increased
- Enter: `show interface fastEthernet 0/4 status`
- Verify port status shows "err-disabled"
- Enter: `show logging`
- Verify violation is logged

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### Port Recovery Testing
- On Multilayer Switch0, enter:
```
configure terminal
interface fastEthernet 0/4
shutdown
no shutdown
end
```
- Verify port returns to normal operation:
- Enter: `show interface fastEthernet 0/4 status`

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### 2.2.2 Test DHCP Snooping and ARP Inspection

##### DHCP Snooping Verification
- On Multilayer Switch0, enter: `show ip dhcp snooping`
- Verify DHCP snooping is enabled on appropriate VLANs
- Enter: `show ip dhcp snooping binding`
- Verify DHCP bindings exist for connected clients
- Enter: `show ip dhcp snooping statistics`
- Verify DHCP packets are being processed

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### Dynamic ARP Inspection Testing
- On Multilayer Switch0, enter: `show ip arp inspection`
- Verify ARP inspection is enabled on appropriate VLANs
- Enter: `show ip arp inspection statistics`
- Verify ARP packets are being inspected
- If testing environment permits, attempt ARP spoofing
- Verify spoofed packets are dropped

**Evidence:**
```
[Insert screenshot or terminal output here]
```

### 2.3 ASA Firewall Testing

#### 2.3.1 Test Firewall Access Rules

##### External Access Control Testing
- From external network, attempt to ping internal hosts
- Verify pings are blocked by firewall
- From external network, attempt connection to allowed services
- Verify only permitted services are accessible

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### Access List Verification
- Connect to ASA via console
- Enter: `show access-list`
- Verify access lists are configured correctly
- Enter: `show access-list | include hit-cnt`
- Verify hit counts increment on access list entries
- Enter: `show conn count`
- Verify connection count statistics

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### 2.3.2 Test SSL/TLS Security (Heartbleed Mitigation)

##### SSL/TLS Configuration Verification
- Connect to ASA via console
- Enter: `show ssl`
- Verify TLS 1.2 is enabled and SSLv3 is disabled
- Enter: `show ssl cipher`
- Verify secure cipher suites are configured
- Enter: `show running-config ssl`
- Verify overall SSL configuration

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### Heartbleed Vulnerability Testing (If Environment Permits)
- Use a Heartbleed testing tool
- Verify the ASA is not vulnerable to Heartbleed

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### 2.3.3 Test Deep Packet Inspection

##### Application Inspection Verification
- Connect to ASA via console
- Enter: `show service-policy`
- Verify inspection policies are applied
- Enter: `show conn detail | include inspect`
- Verify connections are being inspected
- Enter: `show service-policy statistics`
- Review inspection statistics

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### 2.3.4 Test NAT Functionality

##### NAT Configuration Verification
- Connect to ASA via console
- Enter: `show nat`
- Verify NAT rules are configured correctly
- Enter: `show xlate`
- Verify translation table entries exist
- Enter: `show conn`
- Verify connections are established with translation

**Evidence:**
```
[Insert screenshot or terminal output here]
```

### 2.4 Database Security Testing

#### 2.4.1 Test SQL Injection Protection

##### Network Isolation Testing
- From various network segments, attempt to reach database server
- Verify only authorized segments can reach the server
- Enter: `ping 192.168.50.10` from various hosts
- Verify expected connectivity results

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### Database Access Control Testing
- Attempt to connect to database with unauthorized credentials
- Verify connection is rejected
- Attempt to connect to database with authorized credentials
- Verify connection is accepted

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### SQL Injection Testing (If Environment Permits)
- Use SQL injection testing tools against database
- Verify injection attempts are blocked
- Check database logs for blocked attempts

**Evidence:**
```
[Insert screenshot or terminal output here]
```

### 2.5 AAA Server Testing

#### 2.5.1 Test TACACS+ Authentication

##### Authentication Verification
- Connect to Router0 via console
- Attempt login with user defined in TACACS+
- Verify authentication succeeds
- Check AAA server logs for authentication record

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### Authorization Testing
- Login with different privilege level users
- Verify appropriate command authorization
- Attempt unauthorized commands
- Verify commands are rejected

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### Accounting Verification
- Execute various commands on a router
- On AAA server, check accounting logs
- Verify commands are logged appropriately

**Evidence:**
```
[Insert screenshot or terminal output here]
```

### 2.6 Wireless Security Testing

#### 2.6.1 Test Wireless Authentication

##### WPA2 Authentication Testing
- Attempt to connect to wireless network with incorrect passphrase
- Verify connection fails
- Attempt to connect with correct passphrase
- Verify connection succeeds

**Evidence:**
```
[Insert screenshot or terminal output here]
```

##### Wireless Isolation Testing
- From wireless client, attempt to reach protected resources
- Verify only authorized resources are accessible
- Attempt to reach other wireless clients directly
- Verify client isolation if configured

**Evidence:**
```
[Insert screenshot or terminal output here]
```

## 3. Comprehensive Security Validation

### 3.1 Phishing Protection Testing

#### Email Filtering Test
- If email server is configured, send test phishing email
- Verify email is blocked or flagged
- Check ASA logs for content filtering hits

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### URL Filtering Test
- From internal client, attempt to access known malicious URLs
- Verify access is blocked by ASA
- Check ASA logs for URL filtering hits

**Evidence:**
```
[Insert screenshot or terminal output here]
```

### 3.2 End-to-End Vulnerability Testing

#### Network Security Scan
- If available, use vulnerability scanner from different network segments
- Scan various targets including routers, switches, servers
- Analyze results for security gaps
- Verify expected protections are in place

**Evidence:**
```
[Insert screenshot or terminal output here]
```

#### Protocol-Specific Security Testing
- Test HTTPS connections to verify secure TLS
- Test SSH connections to verify encryption
- Test database connections to verify encryption
- Verify protocols use expected security measures

**Evidence:**
```
[Insert screenshot or terminal output here]
```

## 4. Performance Testing

### 4.1 Baseline Performance Measurement

- Measure network throughput without security features:
```
ping -f -l 1500 [target_ip]  # On Windows
```
- Record baseline performance metrics

**Evidence:**
```
[Insert screenshot or terminal output here]
```

### 4.2 Full Security Performance Measurement

- Repeat performance tests with all security features enabled
- Compare results to baseline
- Identify any significant performance impacts
- Adjust security settings if necessary to optimize performance

**Evidence:**
```
[Insert screenshot or terminal output here]
```

### 4.3 Performance Impact Assessment Report

| Security Feature | Baseline Performance | Performance with Feature | Impact Percentage | Notes |
|------------------|----------------------|--------------------------|-------------------|-------|
| Port Security    |                      |                          |                   |       |
| DHCP Snooping    |                      |                          |                   |       |
| DAI              |                      |                          |                   |       |
| ACLs             |                      |                          |                   |       |
| NAT              |                      |                          |                   |       |
| Deep Inspection  |                      |                          |                   |       |
| VPN              |                      |                          |                   |       |
| RIP Auth         |                      |                          |                   |       |

## 5. References

Herzog, P. (2021). *OSSTMM 3 – The Open Source Security Testing Methodology Manual: Contemporary security testing and analysis*. ISECOM. https://www.isecom.org/OSSTMM.3.pdf

Kent, K., & Souppaya, M. (2020). *Guide to computer security log management* (NIST Special Publication 800-92). National Institute of Standards and Technology. https://doi.org/10.6028/NIST.SP.800-92

National Institute of Standards and Technology (NIST). (2021). *Technical guide to information security testing and assessment* (NIST Special Publication 800-115). https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf

Cisco Systems, Inc. (2023). Cisco IOS security command reference. https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/security/a1/sec-a1-cr-book.html

NIST. (2020). Security and privacy controls for information systems and organizations (NIST Special Publication 800-53, Rev. 5). https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf

NIST. (2018). Risk management framework for information systems and organizations (NIST Special Publication 800-37, Rev. 2). https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-37r2.pdf

OWASP Foundation. (2023). Network security testing guide. https://owasp.org/www-project-web-security-testing-guide/
