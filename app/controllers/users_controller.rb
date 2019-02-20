# user's external profile page

class UsersController < ApplicationController
  before_action :set_request_format, only: [:show]
  before_action :require_logged_in_user!,
    only: [:update, :board, :update_board]

  def show
    @user = User.find_by_username(params[:username])
    unless @user.present?
      render "pages/not_found", status: 404
      return
    end
    if @user == current_user
      render "users/me"
      return
    end
  end

  # when user sets a tagline
  def update
    current_user.update_attributes! user_params
    redirect_back fallback_location: root_url
  end

  # customize a board
  def board
    @board = current_user.user_chessboard
  end

  def update_board
    board = current_user.user_chessboard || current_user.build_user_chessboard
    board.update_attributes! board_params
    redirect_back fallback_location: root_url
  end

  private

  def user_params
    params.require(:user).permit(:tagline)
  end

  def board_params
    params.require(:board).permit(
      :light_square_color,
      :dark_square_color,
      :opponent_from_square_color,
      :opponent_to_square_color,
      :selected_square_color
    )
  end

  def set_request_format
    request.format = :html
  end
end
