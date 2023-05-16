import '@material/mwc-snackbar';

/**
 * Shows a snackbar
 *
 * @param {string} labelText
 * @param {number|false} timeoutMs Automatic dismiss timeout in milliseconds. Value must be
 * between 4000 and 10000 (or false to disable the timeout completely) or an error will be
 * thrown. Defaults to 5000 (5 seconds).
 * @param {string} actionText Text of the action button
 * @param {string} cancelText Text of the cancel button
 * @param {boolean} closeOtherSnackbars Whether to close other snackbars before showing this one.
 */
export async function showSnackbar(
  labelText: string,
  timeoutMs: number | false = 5000,
  actionText = 'OK',
  cancelText: string | false = false,
  closeOtherSnackbars = true
): Promise<string | 'action' | 'dismiss' | undefined> {
  return new Promise((resolve) => {
    if (closeOtherSnackbars) {
      const snackbars = document.querySelectorAll('mwc-snackbar');

      for (const snackbar1 of snackbars) {
        if (snackbar1.open) {
          snackbar1.close();
        }

        snackbar1.remove();
      }
    }

    const snackbar = document.createElement('mwc-snackbar');
    snackbar.labelText = labelText;
    snackbar.timeoutMs = timeoutMs || -1;

    if (actionText) {
      const button = document.createElement('md-text-button');
      button.slot = 'action';
      button.textContent = actionText;
      snackbar.append(button);
    }

    if (cancelText) {
      const button = document.createElement('md-text-button');
      button.slot = 'cancel';
      button.textContent = cancelText;
      snackbar.append(button);
    }
    document.body.append(snackbar);

    snackbar.addEventListener('MDCSnackbar:closed', (event: Event & Partial<{detail: {reason?: string}}>) => {
      snackbar.close();
      resolve(event.detail?.reason);
    });

    snackbar.show();
  });
}
