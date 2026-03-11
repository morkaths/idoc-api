import math
import numpy as np
import pandas as pd

class UserBasedCF:
    """
    Thuật toán Lọc cộng tác dựa trên người dùng (User-based Collaborative Filtering).
    """
    def __init__(self, k: int = 20):
        """
        Khởi tạo thuật toán User-based Collaborative Filtering.
        @param k: Số lượng láng giềng cần xét
        """
        self.k = k
        self.R: pd.DataFrame = pd.DataFrame()   # Ma trận tương tác (User-Item)
        self.W: pd.DataFrame = pd.DataFrame()   # Ma trận tương đồng (User-User)
        self.r_bar: pd.Series = pd.Series()     # Điểm trung bình của từng user

    def fit(self, df: pd.DataFrame):
        """
        Training model
        """
        self.R = self.build_matrix(df)
        self.r_bar = pd.Series(np.nanmean(self.R.replace(0, np.nan).values, axis=1), index=self.R.index)
        self.W = self.build_similarity()
        
    @staticmethod
    def build_matrix(df: pd.DataFrame, min_user_ratings: int = 10) -> pd.DataFrame:
        """
        Xây dựng ma trận tương tác R (User-Item)
        """
        counts = df.groupby('user_id')['rating'].count()
        active_users = counts[counts >= min_user_ratings].index
        filtered_df = df[df['user_id'].isin(active_users)]
        return filtered_df.pivot_table(
            index='user_id', 
            columns='item_id', 
            values='rating'
        ).fillna(0)

    def build_similarity(self) -> pd.DataFrame:
        """
        Xây dựng ma trận tương đồng W (User-User)
        """
        # 1. Thay 0 → NaN (0 = chưa đánh giá, không tính vào mean)
        R_nan = self.R.replace(0, np.nan).values

        # 2. Tính r̄_u: mean rating của từng user u
        r_bar_u = np.nanmean(R_nan, axis=1, keepdims=True)

        # 3. Tính (r_{u,i} - r̄_u): mean-centered
        r_ui_centered = np.where(np.isnan(R_nan), 0, R_nan - r_bar_u)

        # 4. Tính √Σ(r_{u,i} - r̄_u)²: chuẩn L2 (mẫu số)
        norm_u = np.linalg.norm(r_ui_centered, axis=1, keepdims=True)
        norm_u[norm_u == 0] = 1   # tránh chia 0

        # 5. Normalize cho từng user
        r_ui_normalized = r_ui_centered / norm_u

        # 6. Tính Pearson Similarity
        W = r_ui_normalized @ r_ui_normalized.T
        return pd.DataFrame(W, index=self.R.index, columns=self.R.index)
    
    def predict(self, u: str, i: str, min_voters: int= 5):
        """
        Dự đoán rating của user cho item
        """
        # 1. Xử lý ngoại lệ (Cold Start)
        if u not in self.R.index or i not in self.R.columns:
            return None
        
        # 2. Tìm láng giềng của u
        N_u = self.W[u].drop(u).nlargest(self.k)
        N_u = N_u[N_u > 0]
        if N_u.empty: return None

        # 3. Tìm những user đã thực sự đánh giá item i
        V_i = self.R[self.R[i] > 0].index

        # 4. Láng giềng của u VÀ đã đánh giá i
        neighbors = N_u.index.intersection(V_i)
        if len(neighbors) < min_voters:
            return None
        
        # 5. Tính toán Mean-Centering
        w        = N_u[neighbors]
        r_vi     = self.R.loc[neighbors, i]
        r_bar_v  = self.r_bar[neighbors]

        numerator   = (w * (r_vi - r_bar_v)).sum()
        denominator = w.abs().sum()
        
        if denominator == 0: return self.r_bar[u]
        predicted = self.r_bar[u] + (numerator / denominator)
        return float(np.clip(predicted, 1, 10))

    def recommend(self, u: str, n: int = 10, min_voters: int = 5):
        """
        Gợi ý top-n item cho user u
        """
        # 1. Cold Start
        if u not in self.R.index:
            return None
        
        # 2. Láng giềng của u
        N_u = self.W[u].drop(u).nlargest(self.k)
        N_u = N_u[N_u > 0]
        if N_u.empty: return None

        # 3. Ứng viên: item láng giềng đã đánh giá, u chưa đọc
        R_neighbors = self.R.loc[N_u.index]
        I_u = set(self.R.loc[u][self.R.loc[u] > 0].index)
        C   = [i for i in R_neighbors.columns
                if R_neighbors[i].gt(0).any() and i not in I_u]
        
        # Tính dự đoán cho từng item chưa đánh giá
        recommendations = []
        for i in C:
            score = self.predict(u, i)
            if score is not None:
                recommendations.append((i, score))

        if not recommendations: return None
        return (
            pd.DataFrame(recommendations, columns=['item_id', 'score'])
            .sort_values(by='score', ascending=False)
            .head(n)
        )


        
