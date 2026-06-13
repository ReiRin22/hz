#!/bin/bash
echo "Cleaning up unused components..."

# Remove unused components
rm -f components/SidePanel.tsx
rm -f components/ProgressHandover.tsx
rm -f components/LoginUserInfo.tsx
rm -f tmp/delete_file.txt
rm -rf tmp/

echo "Removed unused components:"
echo "- SidePanel.tsx (replaced by HamburgerMenu)"
echo "- ProgressHandover.tsx (not used in current version)"
echo "- LoginUserInfo.tsx (integrated into PatientHeader)"
echo "- tmp directory and contents"
echo "Cleanup completed!"