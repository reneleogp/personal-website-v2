---
date: '2026-05-01'
title: 'Software Engineer Intern, Azure GPU Infrastructure'
company: 'Microsoft — Azure GPU Infrastructure'
location: 'Redmond, Washington'
range: 'May - Aug. 2026'
url: 'https://azure.microsoft.com/'
---

- Saved over $1M in GPU provisioning test infrastructure by replacing physical test servers with an ~$80/month Azure virtual lab, eliminating the need to validate provisioning changes on production hardware.
- Emulated bare-metal GPU nodes as KVM/QEMU VMs with per-node Redfish BMC emulators, PXE/DHCP networking, UEFI boot, and NVMe RAID 0 storage, so production tooling treated them as physical servers.
- Shipped a CI/CD pipeline that provisions isolated virtual racks on demand in ~30 minutes using Bicep and cloud-init, allowing multiple engineers to validate provisioning changes concurrently without competing for shared GPU hardware.
