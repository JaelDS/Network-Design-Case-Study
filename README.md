# Network Security Implementation Project
## Addressing Five Major Cybersecurity Vulnerabilities

This repository contains the configuration files and implementation guidelines for a comprehensive network security solution designed to address five critical cybersecurity vulnerabilities.

![Network Topology](https://github.com/JaelDS/Network-Design-Case-Study/blob/main/Resources/Original.png)
*Fig. 1: Network Security Topology*

## Table of Contents
- [Project Overview](#project-overview)
- [Threat Assessment](#threat-assessment)
- [Network Design](#network-design)
- [Security Components](#security-components)
- [Implementation Guide](#implementation-guide)
- [IP Addressing Scheme](#ip-addressing-scheme)
- [Configuration Files](#configuration-files)
- [Security Considerations](#security-considerations)
- [Testing Procedures](#testing-procedures)
- [Future Enhancements](#future-enhancements)
- [References](#references)

## Project Overview

This project implements a defense-in-depth network security strategy addressing these critical vulnerabilities:

1. **Heartbleed** - Critical vulnerability in OpenSSL that exposes memory contents
2. **SQL Injection** - Attack that exploits database access through input manipulation
3. **Man-in-the-Middle (MITM)** - Interception of communication between endpoints
4. **BGP Route Poisoning** - Malicious routing table manipulation
5. **Phishing** - Social engineering to steal credentials and gain access

## Threat Assessment

The following matrix shows the risk assessment for each vulnerability:

| Threat | Risk Level | Attacker ROI | Attack Effort | Detection | Primary Impact |
|--------|------------|--------------|---------------|-----------|----------------|
| Heartbleed | Critical | High | Low | Difficult | Data Exposure, Key Compromise |
| SQL Injection | High | High | Low | Detectable | Database Access, Data Manipulation |
| MITM | Medium | Medium | Medium | Moderate | Confidentiality, Session Hijacking |
| Route Poisoning | Medium | Medium | Medium | Moderate | Network Availability, Traffic Redirection |
| Phishing | High | High | Low | Moderate | Credential Theft, Initial Access |

## Network Design

The network topology implements a multi-layered security approach with these key components:

- **Perimeter Security Layer**
  - Next Generation Firewall (NGFW)
  - Intrusion Prevention System (IPS)

- **Network Segmentation Layer**
  - VLANs
  - Access Control Lists (ACLs)

- **Authentication & Access Control Layer**
  - Triple-A (AAA) Server
  - 802.1X Port Authentication

- **Secure Communication Layer**
  - Virtual Private Networks (VPN)
  - OSPF with Multi-Factor Authentication

## Security Components

### Integrated Security Solution by OSI Layer

| OSI Layer | Security Solution | Threats Addressed |
|-----------|-------------------|-------------------|
| Layer 7 - Application | NGFW, AAA Server | Phishing, MITM, Heartbleed |
| Layer 6 - Presentation | VPN for Wireless | MITM |
| Layer 5 - Session | AAA Server, VPN | Phishing, MITM |
| Layer 4 - Transport | NGFW, ACLs | Phishing, MITM, Heartbleed, Route Poisoning |
| Layer 3 - Network | NGFW, OSPF Authentication, ACLs, VPN | Phishing, MITM, Heartbleed, Route Poisoning |
| Layer 2 - Data Link | VLAN Segmentation, 802.1X Port Authentication | SQL Injection, Phishing, MITM |
| Layer 1 - Physical | Physical security measures | Not directly addressed |

## Implementation Guide

The implementation follows these steps:

1. **Device Selection and Placement**
   - Routers: Cisco 1941, 1841, 2911
   - Switches: Cisco 3560-24PS
   - Servers: Server-PT for AAA and Database
   - Wireless: WRT300N
   - End devices: PC-PT and Laptop-PT

2. **Network Connectivity**
   - Connect devices according to the topology diagram
   - Ensure all physical interfaces are properly cabled

3. **Basic Configuration**
   - Configure hostnames, passwords, and management access
   - Set up IP addressing on all interfaces
   - Enable required services and protocols

4. **Security Implementation**
   - Configure VLANs for network segmentation
   - Set up OSPF routing with authentication
   - Implement AAA server integration
   - Configure 802.1X port authentication
   - Set up NGFW security policies
   - Establish VPN for secure remote access

## IP Addressing Scheme

| Device | Interface | IP Address | Subnet Mask | Purpose |
|--------|-----------|------------|-------------|---------|
| R0 (1941) | GigabitEthernet0/0 | 10.0.0.1 | 255.255.255.0 | Connection to R2 |
| R0 (1941) | GigabitEthernet0/1 | 10.0.1.1 | 255.255.255.0 | Connection to S2 |
| R0 (1941) | GigabitEthernet0/2 | 10.0.2.1 | 255.255.255.0 | Connection to AAA Server |
| R0 (1941) | GigabitEthernet0/3 | 10.0.3.1 | 255.255.255.0 | Connection to R3 |
| R2 (1841) | GigabitEthernet0/0 | 10.0.0.2 | 255.255.255.0 | Connection to R0 |
| R2 (1841) | GigabitEthernet0/1 | 10.1.0.1 | 255.255.255.0 | Connection to S0 |
| R2 (1841) | GigabitEthernet0/2 | 10.1.1.1 | 255.255.255.0 | Connection to Wireless Router |
| R3 (2911) | GigabitEthernet0/0 | 10.0.3.2 | 255.255.255.0 | Connection to R0 |
| R3 (2911) | GigabitEthernet0/1 | 192.168.1.1 | 255.255.255.0 | Connection to Internet |
| S0 | VLAN 10 | 10.1.10.1 | 255.255.255.0 | PC Management VLAN |
| S0 | VLAN 20 | 10.1.20.1 | 255.255.255.0 | PC User VLAN |
| S2 | VLAN 30 | 10.0.30.1 | 255.255.255.0 | Server Management VLAN |
| S2 | VLAN 40 | 10.0.40.1 | 255.255.255.0 | Database VLAN |
| AAA Server | NIC | 10.0.2.10 | 255.255.255.0 | Authentication Services |
| Database Server | NIC | 10.0.40.10 | 255.255.255.0 | Database Services |
| WRT300N | WAN | 10.1.1.2 | 255.255.255.0 | Connection to R2 |
| WRT300N | LAN | 172.16.0.1 | 255.255.255.0 | Wireless Network |

## Configuration Files

The repository includes these configuration files:

```
/
├── configs/
│   ├── routers/
│   │   ├── R0_config.txt
│   │   ├── R2_config.txt
│   │   └── R3_config.txt
│   ├── switches/
│   │   ├── S0_config.txt
│   │   └── S2_config.txt
│   ├── servers/
│   │   ├── AAA_setup.txt
│   │   └── database_config.txt
│   └── wireless/
│       └── WRT300N_config.txt
├── documentation/
│   ├── implementation_guide.md
│   ├── testing_procedures.md
│   └── security_analysis.md
├── images/
│   ├── network_topology.png
│   ├── security_layers.png
│   └── threat_matrix.png
├── packet_tracer/
│   └── network_security_project.pkt
├── LICENSE
└── README.md
```

## Security Considerations

The security implementation involves certain tradeoffs:

- **NGFW Performance Impact**: Deep packet inspection may reduce throughput on high-traffic networks
- **AAA Server Resilience**: Centralized authentication creates a potential single point of failure
- **VPN Overhead**: Encryption/decryption processes add computational overhead
- **ACL Complexity**: Rule management becomes challenging at scale
- **802.1X Deployment**: Requires client configuration and compatibility testing

## Testing Procedures

Security testing includes:

1. **Connectivity Testing**: Verify basic network connectivity
2. **Authentication Testing**: Validate AAA server integration
3. **Segmentation Testing**: Confirm VLAN isolation
4. **Security Control Testing**: Test ACLs and firewall rules
5. **Vulnerability Assessment**: Evaluate protection against the five key threats
6. **Performance Testing**: Measure impact of security controls on network performance

![Testing Results](https://github.com/JaelDS/Network-Design-Case-Study/blob/main/network-security-testing.md)

## Future Enhancements

Potential improvements include:

1. Implementing redundant AAA servers for high availability
2. Deploying network monitoring and SIEM solutions
3. Adding automated security policy enforcement
4. Implementing DNS security and web filtering
5. Enhancing endpoint protection

## References

For detailed information on the vulnerabilities and security solutions, refer to these resources:

- Durumeric, Z., Li, F., et al. (2014). The Matter of Heartbleed
- OWASP Foundation. (2023). OWASP Top Ten Web Application Security Risks
- Conti M., Dragoni N. and Lesyk V. (2016). A Survey of Man In The Middle Attacks
- Wang, Y., & Xu, M. (2020). Observing BGP Route Poisoning in the Wild
- Proofpoint. (2023). State of the Phish

For the complete reference list, see the detailed research report.

## Authors

Jose Antonio Escalante Lopez, Cyrus Mokua
