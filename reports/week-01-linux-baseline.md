# Week 1 — Linux Security Baseline

## 1. Environment

| Item | Observation |
|---|---|
| Operating system | Ubuntu on WSL2 |
| Kernel | 5.10.16.3-microsoft-standard-WSL2 |
| Hostname | ubuntu |
| Current user | gabbytech |
| Repository path | /home/gabbytech/vulnmart-security-lab |

## 2. Users and privileges

The current user is `gabbytech`, with UID 1000. The account belongs to the `sudo` group and can execute administrative commands through sudo. This is useful for lab administration, but unrestricted administrative access should be limited in production because a compromised account could make system-wide changes.

## 3. Running services and processes

The environment is running under WSL2 without systemd as PID 1. Therefore, `systemctl` could not list services. The process inspection showed the WSL `/init` processes, the Bash shell, and the inspection commands. This is a limitation of the lab environment rather than evidence that no services exist.

## 4. Listening ports

The command `sudo ss -tulpen` returned no listening TCP or UDP sockets at the time of inspection. This means no network service was detected as listening inside the WSL2 environment during the test.

## 5. File permissions

The `/etc/passwd` file was readable by all users but writable only by root. The `/etc/shadow` file was owned by root and the shadow group with more restrictive permissions because it contains password hashes. The project directories were owned by `gabbytech` with permissions `drwxr-xr-x`, allowing the owner to modify them while other users could read and enter them.

## 6. Authentication activity

Traditional authentication logs were not available. `/var/log/auth.log` did not exist, and no journal files were found. This is recorded as an environment limitation of the current WSL2 setup. Sudo access was successfully tested and confirmed for the current user.

## 7. Security improvements

1. Use a dedicated non-root lab account for daily work and reserve sudo for administrative tasks.
2. Enable an appropriate logging service if this environment is later used for service-monitoring practice.
3. Review listening ports regularly and keep unnecessary services disabled.
4. Keep Ubuntu, WSL2, packages, and project dependencies updated.
5. Avoid placing secrets, tokens, private keys, or sensitive logs in the Git repository.

## 8. Questions and uncertainties

- How would systemd and authentication logging change the result on a full Ubuntu virtual machine?
- Which services would be present after deploying the VulnMart application?
- How can network monitoring be added safely to this WSL2 lab?

## 9. Conclusion

The baseline confirmed a clean Ubuntu WSL2 development environment with no listening network ports detected. The main security consideration is that the primary user has unrestricted sudo access. The WSL2 environment also limits service and authentication-log inspection, so a full virtual machine may be useful for later Linux security exercises.

