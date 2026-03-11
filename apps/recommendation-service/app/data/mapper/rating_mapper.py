import pandas as pd
from typing import List, Dict, Any

class RatingMapper:
    """
    Lớp Mapper dùng để chuyển đổi dữ liệu đánh giá sách từ Database (dạng List, Dict hoặc Model)
    sang định dạng chuẩn (Pandas DataFrame hoặc Sparse Matrix) để dùng cho thuật toán Collaborative Filtering.
    """

    @staticmethod
    def toDataFrame(data: list[dict]) -> pd.DataFrame:
        """
        Chuyển đổi dữ liệu thô thành Pandas DataFrame.
        @param data - Danh sách các đối tượng chứa thông tin đánh giá sách
        @returns Pandas DataFrame với các cột user_id, item_id, rating
        """
        if not data:
            return pd.DataFrame(columns=['user_id', 'item_id', 'rating'])

        df = pd.DataFrame(data)
        df = df.dropna(subset=['rating'])

        df['rating'] = df['rating'].astype(float)
        df['user_id'] = df['user_id'].astype(str)
        df['item_id'] = df['item_id'].astype(str)
        df = df.drop_duplicates(subset=['user_id', 'item_id'], keep='last')

        return df
