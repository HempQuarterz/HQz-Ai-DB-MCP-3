#!/bin/bash

echo "=== WSL IPv6 Configuration Fix ==="
echo ""
echo "This script will help configure WSL to handle IPv6 issues"
echo ""

# 1. Check current IPv6 status
echo "1. Current IPv6 status:"
cat /proc/sys/net/ipv6/conf/all/disable_ipv6 2>/dev/null || echo "IPv6 status unknown"
echo ""

# 2. Disable IPv6 temporarily
echo "2. To disable IPv6 temporarily (until reboot):"
echo "   sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1"
echo "   sudo sysctl -w net.ipv6.conf.default.disable_ipv6=1"
echo ""

# 3. Disable IPv6 permanently
echo "3. To disable IPv6 permanently, add to /etc/sysctl.conf:"
echo "   net.ipv6.conf.all.disable_ipv6 = 1"
echo "   net.ipv6.conf.default.disable_ipv6 = 1"
echo "   net.ipv6.conf.lo.disable_ipv6 = 1"
echo ""

# 4. Configure DNS to prefer IPv4
echo "4. To configure DNS to prefer IPv4:"
echo "   Edit /etc/gai.conf and uncomment/add:"
echo "   precedence ::ffff:0:0/96  100"
echo ""

# 5. Force IPv4 for specific hosts
echo "5. To force IPv4 for Supabase, add to /etc/hosts:"
echo "   # Get IPv4 address first:"
echo "   dig +short A db.ktoqznqmlnxrtvubewyz.supabase.co"
echo "   # Then add to /etc/hosts:"
echo "   # <IPv4_ADDRESS> db.ktoqznqmlnxrtvubewyz.supabase.co"
echo ""

# 6. Alternative: Use IPv4-only DNS servers
echo "6. To use IPv4-only DNS servers, edit /etc/resolv.conf:"
echo "   nameserver 8.8.8.8"
echo "   nameserver 8.8.4.4"
echo ""

echo "=== Quick Fix Commands ==="
echo "Run these commands to apply the fixes:"
echo ""
echo "# Disable IPv6 temporarily"
echo "sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1"
echo "sudo sysctl -w net.ipv6.conf.default.disable_ipv6=1"
echo ""
echo "# Get Supabase IPv4 address"
echo "SUPABASE_IP=\$(dig +short A db.ktoqznqmlnxrtvubewyz.supabase.co | head -n1)"
echo "echo \"Adding \$SUPABASE_IP for db.ktoqznqmlnxrtvubewyz.supabase.co\""
echo "echo \"\$SUPABASE_IP db.ktoqznqmlnxrtvubewyz.supabase.co\" | sudo tee -a /etc/hosts"
echo ""
echo "After making changes, restart your Node.js server."