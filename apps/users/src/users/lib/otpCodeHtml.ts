export const otpCodeHtml = (message: string) => {
  return `<!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Template</title>
      <style>
          body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
          table { border-collapse: collapse !important; }
          body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
          a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
          @media screen and (max-width: 525px) {
              .wrapper { width: 100% !important; max-width: 100% !important; }
              .responsive-table { width: 100% !important; }
              .padding { padding: 10px 5% 15px 5% !important; }
              .section-padding { padding: 0 15px 50px 15px !important; }
          }
          .button:hover { background-color: #2d8b99 !important; }
      </style>
  </head>
  <body style="margin: 0 !important; padding: 0 !important; background-color: #f0f0f0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
              <td align="center" style="padding: 0;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" class="responsive-table">
                      <!-- Header -->
                      <tr>
                          <td align="center" bgcolor="#fbfefb" style="padding: 20px 0;">
                          <h2 style="fontSize: 200px; fontWeight: bold;">Taskify</h2>
                          </td>
                      </tr>

                      <!-- White Box Content -->
                     ${message}
                      <!-- White Box Content -->

                      <!-- Footer -->
                      <tr>
                          <td align="center" bgcolor="#f0f0f0" style="padding: 20px 30px; font-family: Arial, sans-serif; font-size: 12px; color: #666666;">
                              <p style="margin: 0;">&copy; 2024 Taskify. All rights reserved.</p>
                              <p style="margin: 10px 0;">
                                  <a href="#" style="color: #3D1FFB; text-decoration: underline;">Privacy Policy</a> &bull;
                                  <a href="#" style="color: #3D1FFB; text-decoration: underline;">Terms of Service</a>
                              </p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>
    `;
};
