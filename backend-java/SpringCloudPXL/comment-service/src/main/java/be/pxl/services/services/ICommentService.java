package be.pxl.services.services;

import be.pxl.services.domain.Comment;

import java.util.List;

public interface ICommentService {
    List<Comment> getAllComments();
}
