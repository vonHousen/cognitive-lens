from pathlib import Path

__all__ = ["get_repo_root"]


def get_repo_root():
    """Return the path to the repository root."""
    current_path = Path(__file__).resolve()
    # Navigate up until we find the repository root (e.g., where data/ exists)
    while current_path.name and not (current_path / "data").exists():
        current_path = current_path.parent
    return current_path
