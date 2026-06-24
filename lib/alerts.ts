import Swal from "sweetalert2";

export async function confirmAction(options: {
  title: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}) {
  const result = await Swal.fire({
    title: options.title,
    text: options.text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText ?? "Confirm",
    cancelButtonText: options.cancelButtonText ?? "Cancel",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
  });

  return result.isConfirmed;
}

export async function showSuccess(title: string, text: string) {
  await Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonText: "Ok",
  });
}

export async function showError(title: string, text: string) {
  await Swal.fire({
    icon: "error",
    title,
    text,
  });
}
